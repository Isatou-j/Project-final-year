import { Router } from 'express';
import {
  createPaymentController,
  getAllPaymentsController,
  getPaymentByIdController,
  updatePaymentController,
  deletePaymentController,
  getPhysicianPaymentsController,
  getPhysicianEarningsController,
} from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createPaymentController);
router.get('/', authMiddleware, getAllPaymentsController);
router.get('/physician', authMiddleware, getPhysicianPaymentsController);
router.get('/physician/earnings', authMiddleware, getPhysicianEarningsController);
router.get('/:id', authMiddleware, getPaymentByIdController);
router.put('/:id', authMiddleware, updatePaymentController);
router.delete('/:id', authMiddleware, deletePaymentController);

export default router;
