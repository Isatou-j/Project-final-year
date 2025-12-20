import { Router } from 'express';
import {
  createPrescriptionController,
  getAllPrescriptionsController,
  getPrescriptionByIdController,
  getPrescriptionByAppointmentIdController,
  getPatientPrescriptionsController,
  getPhysicianPrescriptionsController,
  updatePrescriptionController,
  deletePrescriptionController,
  getPrescriptionStatsController,
} from '../controllers/prescription.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createPrescriptionController);
router.get('/', authMiddleware, getAllPrescriptionsController);
router.get('/stats', authMiddleware, getPrescriptionStatsController);
router.get(
  '/appointment/:appointmentId',
  authMiddleware,
  getPrescriptionByAppointmentIdController,
);
router.get(
  '/patient/:patientId',
  authMiddleware,
  getPatientPrescriptionsController,
);
router.get(
  '/physician/:physicianId',
  authMiddleware,
  getPhysicianPrescriptionsController,
);
router.get('/:id', authMiddleware, getPrescriptionByIdController);
router.put('/:id', authMiddleware, updatePrescriptionController);
router.delete('/:id', authMiddleware, deletePrescriptionController);

export default router;
