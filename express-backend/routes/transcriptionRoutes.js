import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { transcribeAudio } from '../controllers/transcriptionController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.post('/', upload.single('audio'), transcribeAudio);

export default router;
