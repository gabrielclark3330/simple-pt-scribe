import express from 'express';
const router = express.Router();
import { getAllProfiles, getProfileById, updateProfile } from '../controllers/profileController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

// Protect routes with authentication middleware
router.use(authenticateToken);

router.get('/', getAllProfiles);
router.get('/:id', getProfileById);
router.put('/:id', updateProfile);

export default router;
