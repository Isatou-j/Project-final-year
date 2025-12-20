import { Router } from 'express';
import {
  getDashboardStatsController,
  getFinancialReportController,
  getServicePerformanceController,
  getMonthlyTrendsController,
  getPatientsReportController,
  generateScheduledReportsController,
} from '../controllers/reporting.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', authMiddleware, getDashboardStatsController);
router.get('/financial', authMiddleware, getFinancialReportController);
router.get(
  '/service-performance',
  authMiddleware,
  getServicePerformanceController,
);
router.get('/monthly-trends', authMiddleware, getMonthlyTrendsController);
router.get('/patients', authMiddleware, getPatientsReportController);
router.post('/scheduled', authMiddleware, generateScheduledReportsController);

export default router;
