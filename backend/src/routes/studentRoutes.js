import express from 'express';
import * as studentController from '../controllers/studentController.js';
import { studentLookupLimiter, studentSubmitLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/lookup/:regNo', studentLookupLimiter, studentController.lookupStudent);
router.post('/submit', studentSubmitLimiter, studentController.submitForm);

export default router;
