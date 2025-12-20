import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import type { Reviews } from '@/types/landing';

export interface ReviewsResponse {
  reviews: Reviews[];
  total: number;
  page: number;
  limit: number;
  averageRating: number;
}

// Hook for fetching reviews
export const useReviews = (params?: {
  page?: number;
  limit?: number;
  physicianId?: string;
  rating?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: async () => {
      const response = await apiClient.get<ReviewsResponse>('/reviews', {
        params,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for fetching featured reviews (top rated, recent)
export const useFeaturedReviews = (limit: number = 6) => {
  return useQuery({
    queryKey: ['reviews', 'featured', limit],
    queryFn: async () => {
      const response = await apiClient.get<Reviews[]>('/reviews', {
        params: {
          limit,
          sortBy: 'rating',
          sortOrder: 'desc',
        },
      });
      // API returns array directly, wrap it in expected format
      return {
        reviews: response.data,
        total: response.data.length,
        page: 1,
        limit,
        averageRating:
          response.data.length > 0
            ? response.data.reduce((sum, review) => sum + review.rating, 0) /
              response.data.length
            : 0,
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
};

// Hook for fetching reviews statistics
export interface ReviewsStatistics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
}

export interface ReviewsStatsResponse {
  success: boolean;
  data: ReviewsStatistics;
}

export const useReviewsStatistics = () => {
  return useQuery({
    queryKey: ['reviews', 'statistics'],
    queryFn: async () => {
      const response = await apiClient.get<ReviewsStatsResponse>(
        '/reviews/statistics',
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

// Admin review types
export interface AdminReview {
  id: number;
  physicianId: number;
  patientName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  physician: {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
  };
}

export interface AdminReviewsResponse {
  reviews: AdminReview[];
  total: number;
  page: number;
  limit: number;
}

// Hook for fetching admin reviews
export const useAdminReviews = (params?: {
  page?: number;
  limit?: number;
  rating?: number;
  physicianId?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['reviews', 'admin', params],
    queryFn: async () => {
      const response = await apiClient.get<AdminReviewsResponse>(
        '/reviews/admin/getAll',
        {
          params,
        },
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for deleting a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/reviews/admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'admin'] });
    },
  });
};
