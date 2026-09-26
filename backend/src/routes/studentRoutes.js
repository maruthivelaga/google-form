import express from 'express';
import * as studentController from '../controllers/studentController.js';

const router = express.Router();

router.get('/lookup/:regNo', studentController.lookupStudent);
router.post('/submit', studentController.submitForm);

export default router;
