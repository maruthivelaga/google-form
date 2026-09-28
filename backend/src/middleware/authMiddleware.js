import { verifyToken } from '../services/tokenService.js';

/**
 * Authentication middleware for Admin API routes.
 * Supports Authorization header: Bearer <token>
 * and query parameter: ?token=<token> (useful for direct file export downloads)
 */
export const requireAdminAuth = (req, res, next) => {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
    } else if (req.query && req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({
            error: 'Authentication required. Please log in as administrator.'
        });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
        return res.status(401).json({
            error: 'Invalid or expired session. Please log in again.'
        });
    }

    req.admin = payload;
    next();
};
