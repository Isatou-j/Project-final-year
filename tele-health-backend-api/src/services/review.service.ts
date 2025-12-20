import prisma from '../lib/prisma';

export interface CreateReviewData {
  physicianId: number;
  patientName: string;
  rating: number;
  comment?: string;
}

export interface ReviewResponse {
  id: number;
  physicianId: number;
  patientName: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  profileUrl?: string;
  role: string;
}

/**
 * Get all reviews for a specific physician with pagination and filtering
 */
export const getReviewsByPhysician = async (
  physicianId: number,
  page?: number,
  limit?: number,
  rating?: number,
  sortBy?: 'createdAt' | 'rating',
  sortOrder?: 'asc' | 'desc',
): Promise<{
  reviews: ReviewResponse[];
  total: number;
  page: number;
  limit: number;
}> => {
  const pageNumber = page || 1;
  const limitNumber = limit || 10;
  const skip = (pageNumber - 1) * limitNumber;

  // Build where clause
  const whereClause: any = {
    physicianId,
  };

  if (rating) {
    whereClause.rating = rating;
  }

  // Build orderBy clause
  const orderBy: any = {};
  const sortField = sortBy || 'createdAt';
  const sortDirection = sortOrder || 'desc';
  orderBy[sortField] = sortDirection;

  // Get total count
  const total = await prisma.review.count({
    where: whereClause,
  });

  // Get paginated reviews
  const reviews = await prisma.review.findMany({
    where: whereClause,
    orderBy,
    skip,
    take: limitNumber,
  });

  const reviewResponses = reviews.map(review => ({
    id: review.id,
    physicianId: review.physicianId,
    patientName: review.patientName,
    rating: review.rating,
    comment: review.comment || undefined,
    createdAt: review.createdAt,
    profileUrl: undefined, // TODO: Add patient profile URL when available
    role: 'patient',
  }));

  return {
    reviews: reviewResponses,
    total,
    page: pageNumber,
    limit: limitNumber,
  };
};

/**
 * Get public testimonials (reviews with comments) for a physician
 * Used for landing page testimonials section
 */
export const getPublicTestimonials = async (
  physicianId?: number,
  limit: number = 10,
): Promise<ReviewResponse[]> => {
  const whereClause = physicianId
    ? { physicianId, comment: { not: null } }
    : { comment: { not: null } };

  const reviews = await prisma.review.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  return reviews.map(review => ({
    id: review.id,
    physicianId: review.physicianId,
    patientName: review.patientName,
    rating: review.rating,
    comment: review.comment!,
    createdAt: review.createdAt,
    profileUrl: undefined, // TODO: Add patient profile URL when available
    role: 'patient',
  }));
};

/**
 * Create a new review/testimonial
 */
export const createReview = async (
  data: CreateReviewData,
): Promise<ReviewResponse> => {
  // Validate rating is between 1-5
  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Check if physician exists and is approved
  const physician = await prisma.physician.findFirst({
    where: {
      id: data.physicianId,
      status: 'APPROVED',
    },
  });

  if (!physician) {
    throw new Error('Physician not found or not approved');
  }

  const review = await prisma.review.create({
    data: {
      physicianId: data.physicianId,
      patientName: data.patientName,
      rating: data.rating,
      comment: data.comment,
    },
  });

  return {
    id: review.id,
    physicianId: review.physicianId,
    patientName: review.patientName,
    rating: review.rating,
    comment: review.comment || undefined,
    createdAt: review.createdAt,
    profileUrl: undefined, // TODO: Add patient profile URL when available
    role: 'patient',
  };
};

/**
 * Get review statistics for a physician
 */
export const getReviewStats = async (physicianId: number) => {
  const reviews = await prisma.review.findMany({
    where: {
      physicianId,
    },
  });

  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  const ratingDistribution = reviews.reduce(
    (dist, review) => {
      dist[review.rating as keyof typeof dist] =
        (dist[review.rating as keyof typeof dist] || 0) + 1;
      return dist;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  );

  return {
    totalReviews: reviews.length,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    ratingDistribution,
  };
};

/**
 * Get all reviews for admin management
 */
export const getAllReviews = async (
  page?: number,
  limit?: number,
  rating?: number,
  physicianId?: number,
  search?: string,
) => {
  const whereClause: any = {};

  if (rating) {
    whereClause.rating = rating;
  }

  if (physicianId) {
    whereClause.physicianId = physicianId;
  }

  if (search) {
    whereClause.OR = [
      { patientName: { contains: search, mode: 'insensitive' } },
      { comment: { contains: search, mode: 'insensitive' } },
    ];
  }

  const reviews = await prisma.review.findMany({
    where: whereClause,
    include: {
      physician: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          specialization: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Apply pagination
  const pageNumber = page || 1;
  const limitNumber = limit || 10;
  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;
  const paginatedReviews = reviews.slice(startIndex, endIndex);

  const reviewResponses = paginatedReviews.map(review => ({
    id: review.id,
    physicianId: review.physicianId,
    patientName: review.patientName,
    rating: review.rating,
    comment: review.comment || undefined,
    createdAt: review.createdAt,
    physician: {
      id: review.physician.id,
      firstName: review.physician.firstName,
      lastName: review.physician.lastName,
      specialization: review.physician.specialization,
    },
  }));

  return {
    reviews: reviewResponses,
    total: reviews.length,
    page: pageNumber,
    limit: limitNumber,
  };
};

/**
 * Delete a review (admin only)
 */
export const deleteReview = async (reviewId: number) => {
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw new Error('Review not found');
  }

  return prisma.review.delete({
    where: { id: reviewId },
  });
};
