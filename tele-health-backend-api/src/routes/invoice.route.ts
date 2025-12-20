import { Router } from 'express';
import {
  createInvoiceController,
  getAllInvoicesController,
  getInvoiceByIdController,
  updateInvoiceController,
  deleteInvoiceController,
  generateInvoicePDFController,
  generateInvoicesReportController,
  getOverdueInvoicesController,
  getInvoiceStatsController,
  markInvoiceAsPaidController,
} from '../controllers/invoice.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createInvoiceController);
router.get('/', authMiddleware, getAllInvoicesController);
router.get('/overdue', authMiddleware, getOverdueInvoicesController);
router.get('/stats', authMiddleware, getInvoiceStatsController);
router.get('/:id', authMiddleware, getInvoiceByIdController);
router.put('/:id', authMiddleware, updateInvoiceController);
router.delete('/:id', authMiddleware, deleteInvoiceController);
router.get('/:id/pdf', authMiddleware, generateInvoicePDFController);
router.post('/:id/mark-paid', authMiddleware, markInvoiceAsPaidController);
router.get(
  '/report/generate',
  authMiddleware,
  generateInvoicesReportController,
);

export default router;
