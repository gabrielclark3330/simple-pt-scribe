import express from 'express';
const router = express.Router();
import { signup, login, validateToken } from '../controllers/authController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

router.post('/signup', signup);
router.post('/login', login);
router.get('/validate', authenticateToken, validateToken);

export default router;
