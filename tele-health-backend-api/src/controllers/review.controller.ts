import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service';
import { CreateReviewData } from '../services/review.service';
import { requireAdmin } from '../middleware/auth.middleware';

/**
 * Get all reviews for a specific physician
 * GET /api/v1/reviews/physician/:physicianId
 */
export const getReviewsByPhysicianController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const physicianId = parseInt(req.params.physicianId);

    if (isNaN(physicianId)) {
      return res.status(400).json({ message: 'Invalid physician ID' });
    }

    // Extract query parameters
    const page = req.query.page
      ? parseInt(req.query.page as string)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const rating = req.query.rating
      ? parseInt(req.query.rating as string)
      : undefined;
    const sortBy = req.query.sortBy as 'createdAt' | 'rating' | undefined;
    const sortOrder = req.query.sortOrder as 'asc' | 'desc' | undefined;

    // Validate parameters
    if (page && (isNaN(page) || page < 1)) {
      return res.status(400).json({ message: 'Invalid page number' });
    }

    if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
      return res.status(400).json({ message: 'Invalid limit (1-100)' });
    }

    if (rating && (isNaN(rating) || rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Invalid rating (1-5)' });
    }

    if (sortBy && !['createdAt', 'rating'].includes(sortBy)) {
      return res
        .status(400)
        .json({ message: 'Invalid sortBy (createdAt or rating)' });
    }

    if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
      return res
        .status(400)
        .json({ message: 'Invalid sortOrder (asc or desc)' });
    }

    const result = await reviewService.getReviewsByPhysician(
      physicianId,
      page,
      limit,
      rating,
      sortBy,
      sortOrder,
    );

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get public testimonials (reviews with comments)
 * GET /api/v1/reviews/testimonials
 * Query params: physicianId (optional), limit (optional, default 10)
 */
export const getPublicTestimonialsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const physicianId = req.query.physicianId
      ? parseInt(req.query.physicianId as string)
      : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (physicianId && isNaN(physicianId)) {
      return res.status(400).json({ message: 'Invalid physician ID' });
    }

    if (limit < 1 || limit > 50) {
      return res
        .status(400)
        .json({ message: 'Limit must be between 1 and 50' });
    }

    const testimonials = await reviewService.getPublicTestimonials(
      physicianId,
      limit,
    );
    return res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new review/testimonial
 * POST /api/v1/reviews
 */
export const createReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { physicianId, patientName, rating, comment }: CreateReviewData =
      req.body;

    // Validate required fields
    if (!physicianId || !patientName || !rating) {
      return res.status(400).json({
        message: 'Missing required fields: physicianId, patientName, rating',
      });
    }

    const reviewData: CreateReviewData = {
      physicianId,
      patientName,
      rating,
      comment,
    };

    const review = await reviewService.createReview(reviewData);
    return res.status(201).json({
      message: 'Review created successfully',
      data: review,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Rating must be between 1 and 5')) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message.includes('Physician not found')) {
        return res.status(404).json({ message: error.message });
      }
    }
    next(error);
  }
};

/**
 * Get review statistics for a physician
 * GET /api/v1/reviews/stats/:physicianId
 */
export const getReviewStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const physicianId = parseInt(req.params.physicianId);

    if (isNaN(physicianId)) {
      return res.status(400).json({ message: 'Invalid physician ID' });
    }

    const stats = await reviewService.getReviewStats(physicianId);
    return res.json(stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reviews for admin management
 * GET /api/v1/reviews/admin/getAll
 */
export const getAllReviewsController = [
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const page = req.query.page
        ? parseInt(req.query.page as string)
        : undefined;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const rating = req.query.rating
        ? parseInt(req.query.rating as string)
        : undefined;
      const physicianId = req.query.physicianId
        ? parseInt(req.query.physicianId as string)
        : undefined;
      const search = req.query.search as string | undefined;

      const result = await reviewService.getAllReviews(
        page,
        limit,
        rating,
        physicianId,
        search,
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Delete a review (admin only)
 * DELETE /api/v1/reviews/admin/:id
 */
export const deleteReviewController = [
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const reviewId = parseInt(req.params.id);

      if (isNaN(reviewId)) {
        return res.status(400).json({ message: 'Invalid review ID' });
      }

      await reviewService.deleteReview(reviewId);

      return res.json({
        message: 'Review deleted successfully',
      });
    } catch (error: any) {
      if (error.message === 'Review not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },
];
