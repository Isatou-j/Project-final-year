import { Router } from 'express';
import {
  getReviewsByPhysicianController,
  getPublicTestimonialsController,
  createReviewController,
  getReviewStatsController,
  getAllReviewsController,
  deleteReviewController,
} from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes for testimonials (no authentication required)
router.get('/', getPublicTestimonialsController);
router.get('/physician/:physicianId', getReviewsByPhysicianController);
router.get('/stats/:physicianId', getReviewStatsController);

// Create review (could be public or require authentication based on requirements)
router.post('/', createReviewController);

// Admin routes
router.get('/admin/getAll', authMiddleware, ...getAllReviewsController);
router.delete('/admin/:id', authMiddleware, ...deleteReviewController);

export default router;
