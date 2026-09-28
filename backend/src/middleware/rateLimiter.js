/**
 * Campus & NAT-Aware In-Memory Rate Limiting
 * 
 * Specially designed for 1,000+ concurrent students sharing the SAME campus / Wi-Fi IP address (NAT).
 * Instead of punishing the entire college IP for legitimate simultaneous traffic:
 * 1. Student Lookup: limits per Registration Number (20 req / 1 min) with high NAT IP allowance (20,000 req / 15 min).
 * 2. Student Submission: limits per Registration Number (5 req / 5 min) with high NAT IP allowance (5,000 req / 15 min).
 * 3. Admin Login: strictly limits failed password attempts (10 failed tries / 15 min).
 */

class MemoryStore {
    constructor() {
        this.store = new Map();
        // Periodically prune expired entries every 5 minutes
        setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
    }

    increment(key, windowMs) {
        const now = Date.now();
        const record = this.store.get(key);

        if (!record || now > record.resetTime) {
            const newRecord = { count: 1, resetTime: now + windowMs };
            this.store.set(key, newRecord);
            return { count: 1, resetTime: newRecord.resetTime };
        }

        record.count += 1;
        return { count: record.count, resetTime: record.resetTime };
    }

    reset(key) {
        this.store.delete(key);
    }

    cleanup() {
        const now = Date.now();
        for (const [key, record] of this.store.entries()) {
            if (now > record.resetTime) {
                this.store.delete(key);
            }
        }
    }
}

const memoryStore = new MemoryStore();

const getClientIp = (req) => {
    return (
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        '127.0.0.1'
    );
};

/**
 * Rate limiter for student lookup
 * Allows 1,000+ students from same IP, but limits lookups per registration number.
 */
export const studentLookupLimiter = (req, res, next) => {
    const ip = getClientIp(req);
    const regNo = String(req.params.regNo || '').trim().toUpperCase();

    // 1. IP NAT safety net (20,000 requests per 15 minutes to easily allow 1000+ students)
    const ipKey = `lookup_ip:${ip}`;
    const ipResult = memoryStore.increment(ipKey, 15 * 60 * 1000);
    if (ipResult.count > 20000) {
        const retryAfterSec = Math.ceil((ipResult.resetTime - Date.now()) / 1000);
        res.setHeader('Retry-After', retryAfterSec);
        return res.status(429).json({
            error: 'High network traffic detected. Please wait a moment and try again.'
        });
    }

    // 2. Per-Registration Number limit (20 lookups per 1 minute)
    if (regNo) {
        const regKey = `lookup_reg:${regNo}`;
        const regResult = memoryStore.increment(regKey, 60 * 1000);
        if (regResult.count > 20) {
            const retryAfterSec = Math.ceil((regResult.resetTime - Date.now()) / 1000);
            res.setHeader('Retry-After', retryAfterSec);
            return res.status(429).json({
                error: `Too many lookup attempts for registration number ${regNo}. Please wait a minute.`
            });
        }
    }

    next();
};

/**
 * Rate limiter for student submission
 * Limits submissions per registration number to prevent duplicate spam,
 * while allowing simultaneous submissions from a single campus NAT IP.
 */
export const studentSubmitLimiter = (req, res, next) => {
    const ip = getClientIp(req);
    const regNo = String(req.body?.registration_number || '').trim().toUpperCase();

    // 1. IP NAT safety net (5,000 submissions per 15 minutes)
    const ipKey = `submit_ip:${ip}`;
    const ipResult = memoryStore.increment(ipKey, 15 * 60 * 1000);
    if (ipResult.count > 5000) {
        const retryAfterSec = Math.ceil((ipResult.resetTime - Date.now()) / 1000);
        res.setHeader('Retry-After', retryAfterSec);
        return res.status(429).json({
            error: 'Server is currently receiving high submission volume. Please retry in a few moments.'
        });
    }

    // 2. Per-Registration Number limit (5 submission attempts per 5 minutes)
    if (regNo) {
        const regKey = `submit_reg:${regNo}`;
        const regResult = memoryStore.increment(regKey, 5 * 60 * 1000);
        if (regResult.count > 5) {
            const retryAfterSec = Math.ceil((regResult.resetTime - Date.now()) / 1000);
            res.setHeader('Retry-After', retryAfterSec);
            return res.status(429).json({
                error: `Multiple submissions detected for ${regNo}. Please wait a few minutes before trying again.`
            });
        }
    }

    next();
};

/**
 * Rate limiter for Admin Login
 * Max 10 failed login attempts per 15 minutes to prevent brute-forcing.
 */
export const checkAdminLoginRateLimit = (req, res, next) => {
    const ip = getClientIp(req);
    const key = `admin_login_fail:${ip}`;
    const record = memoryStore.store.get(key);

    if (record && record.count >= 10 && Date.now() < record.resetTime) {
        const retryAfterSec = Math.ceil((record.resetTime - Date.now()) / 1000);
        res.setHeader('Retry-After', retryAfterSec);
        return res.status(429).json({
            error: `Too many failed admin login attempts. Please wait ${Math.ceil(retryAfterSec / 60)} minutes.`
        });
    }

    next();
};

/**
 * Record a failed admin login attempt
 */
export const recordAdminLoginFailure = (req) => {
    const ip = getClientIp(req);
    const key = `admin_login_fail:${ip}`;
    memoryStore.increment(key, 15 * 60 * 1000);
};

/**
 * Clear failed admin login attempts upon successful login
 */
export const clearAdminLoginFailures = (req) => {
    const ip = getClientIp(req);
    const key = `admin_login_fail:${ip}`;
    memoryStore.reset(key);
};
