import express from 'express';
const router = express.Router();
import { createPatient, getAllPatients, getPatientById, updatePatient } from '../controllers/patientController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

// Protect routes with authentication middleware
router.use(authenticateToken);

router.post('/', createPatient);
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);

export default router;
