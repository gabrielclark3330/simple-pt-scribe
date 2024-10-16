import express from 'express';
const router = express.Router();
import { createNote, getAllNotes, getNoteById, updateNote, getNotesByPatientId } from '../controllers/noteController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

// Protect routes with authentication middleware
router.use(authenticateToken);

router.post('/', createNote);
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.get('/patient/:patientId', getNotesByPatientId);

export default router;
