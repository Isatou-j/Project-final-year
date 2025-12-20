import { Router } from 'express';
import {
  createReceiptController,
  getAllReceiptsController,
  getReceiptByIdController,
  updateReceiptController,
  deleteReceiptController,
  generateReceiptPDFController,
  generateReceiptsReportController,
  getReceiptStatsController,
} from '../controllers/receipt.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createReceiptController);
router.get('/', authMiddleware, getAllReceiptsController);
router.get('/stats', authMiddleware, getReceiptStatsController);
router.get('/:id', authMiddleware, getReceiptByIdController);
router.put('/:id', authMiddleware, updateReceiptController);
router.delete('/:id', authMiddleware, deleteReceiptController);
router.get('/:id/pdf', authMiddleware, generateReceiptPDFController);
router.get(
  '/report/generate',
  authMiddleware,
  generateReceiptsReportController,
);

export default router;
