import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', adminController.login);
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
