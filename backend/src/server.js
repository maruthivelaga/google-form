import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initSchema, autoSeedIfEmpty } from './db/index.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy (Nginx) for accurate IP resolution in rate limiting
app.set('trust proxy', 1);

// Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});

// Configure CORS
app.use(cors({
    origin: true, // Allow frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with size limit to prevent payload flood attacks
app.use(express.json({ limit: '1mb' }));

// API Routes
app.use('/praveentp/students', studentRoutes);
app.use('/praveentp/admin', adminRoutes);

app.get('/praveentp/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
    try {
        // Initialize schema (CREATE TABLE IF NOT EXISTS — safe to always run)
        await initSchema();

        // Auto-seed student data on first run only (skips if table already populated)
        await autoSeedIfEmpty();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`✓ Backend API server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
