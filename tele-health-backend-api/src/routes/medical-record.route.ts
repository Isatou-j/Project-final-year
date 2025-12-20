import { Router } from 'express';
import {
  createMedicalRecordController,
  getAllMedicalRecordsController,
  getMedicalRecordByIdController,
  getPatientMedicalRecordsController,
  updateMedicalRecordController,
  deleteMedicalRecordController,
  getMedicalRecordStatsController,
} from '../controllers/medical-record.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createMedicalRecordController);
router.get('/', authMiddleware, getAllMedicalRecordsController);
router.get('/stats', authMiddleware, getMedicalRecordStatsController);
router.get(
  '/patient/:patientId',
  authMiddleware,
  getPatientMedicalRecordsController,
);
router.get('/:id', authMiddleware, getMedicalRecordByIdController);
router.put('/:id', authMiddleware, updateMedicalRecordController);
router.delete('/:id', authMiddleware, deleteMedicalRecordController);

export default router;
