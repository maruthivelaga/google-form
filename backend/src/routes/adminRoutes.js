import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import { checkAdminLoginRateLimit } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public with brute-force rate limiting
router.post('/login', checkAdminLoginRateLimit, adminController.login);

// Protected Admin API Routes (Requires valid authentication token)
router.use(requireAdminAuth);

router.get('/stats', adminController.getStats);
router.get('/sections', adminController.getSections);
router.get('/options', adminController.getOptions);
router.get('/students', adminController.getStudents);
router.get('/students/:id', adminController.getStudentById);
router.post('/students/:id/reset', adminController.resetStudent);
router.get('/export', adminController.exportCsv);
router.get('/export-section-list', adminController.exportSectionList);
router.get('/export-submitted-excel', adminController.exportSubmittedExcel);

export default router;
