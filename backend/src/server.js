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

app.use(cors());
app.use(express.json());

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
