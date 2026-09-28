import crypto from 'crypto';

// Secret key for HMAC token signing
const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'student-master-production-secret-key-2026';

// RFC 7519 standard JWT header for HS256
const JWT_HEADER = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');

/**
 * Generates an RFC 7519 compliant JSON Web Token (JWT) with HS256 signature
 * Format: header.payload.signature (inspectable on jwt.io)
 * 
 * @param {Object} payload 
 * @param {number} expiresInMs default: 24 hours
 * @returns {string} jwt token
 */
export const generateToken = (payload = {}, expiresInMs = 24 * 60 * 60 * 1000) => {
    const iat = Math.floor(Date.now() / 1000);
    const exp = Math.floor((Date.now() + expiresInMs) / 1000); // JWT exp is in seconds

    const payloadData = Buffer.from(JSON.stringify({
        ...payload,
        iat,
        exp
    })).toString('base64url');

    const signature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${JWT_HEADER}.${payloadData}`)
        .digest('base64url');

    return `${JWT_HEADER}.${payloadData}.${signature}`;
};

/**
 * Verifies the JWT signature and expiration
 * @param {string} token 
 * @returns {Object|null} payload if valid, null if invalid or expired
 */
export const verifyToken = (token) => {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;

    // Verify HS256 signature with constant-time equality check
    const expectedSignature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${header}.${payload}`)
        .digest('base64url');

    try {
        const sigBuffer = Buffer.from(signature);
        const expSigBuffer = Buffer.from(expectedSignature);

        if (sigBuffer.length !== expSigBuffer.length || !crypto.timingSafeEqual(sigBuffer, expSigBuffer)) {
            return null;
        }

        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        const nowSec = Math.floor(Date.now() / 1000);

        if (decodedPayload.exp && nowSec > decodedPayload.exp) {
            return null; // Token expired
        }

        return decodedPayload;
    } catch {
        return null;
    }
};
