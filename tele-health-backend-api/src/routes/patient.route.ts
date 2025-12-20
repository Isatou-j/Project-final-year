import { Router } from 'express';
import {
  getPatientProfileController,
  updatePatientProfileController,
  getPatientMedicalRecordsController,
  getAllPatientsController,
} from '../controllers/patient.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', authMiddleware, getPatientProfileController);
router.put('/profile', authMiddleware, updatePatientProfileController);
router.get(
  '/medical-records',
  authMiddleware,
  getPatientMedicalRecordsController,
);

// Admin routes
router.get('/getAll', authMiddleware, ...getAllPatientsController);

export default router;
