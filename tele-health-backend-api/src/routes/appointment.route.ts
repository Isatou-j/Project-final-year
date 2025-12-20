import { Router } from 'express';
import {
  bookAppointmentController,
  getPatientAppointmentsController,
  getPhysicianAppointmentsController,
  updateAppointmentStatusController,
  cancelAppointmentController,
  getAllAppointmentsController,
} from '../controllers/appointment.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/book', authMiddleware, bookAppointmentController);
router.get('/patient', authMiddleware, getPatientAppointmentsController);
router.get('/physician', authMiddleware, getPhysicianAppointmentsController);
router.patch(
  '/:id/status',
  authMiddleware,
  ...updateAppointmentStatusController,
);
router.patch('/:id/cancel', authMiddleware, cancelAppointmentController);

// Admin routes
router.get('/getAll', authMiddleware, ...getAllAppointmentsController);

export default router;
