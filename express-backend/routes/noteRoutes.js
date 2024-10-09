import express from 'express';
const router = express.Router();
import { createNote, getAllNotes, getNoteById, updateNote } from '../controllers/noteController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

// Protect routes with authentication middleware
router.use(authenticateToken);

router.post('/', createNote);
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);

export default router;
