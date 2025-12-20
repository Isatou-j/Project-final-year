import { useQuery } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import type { ExpertPhysician, LandingPageStats } from '@/types/landing';
import type { PhysicianResponse as AdminPhysicianResponse, Physician } from '@/types/physician';

// Types for physician data
export interface PhysicianResponse {
  physicians: ExpertPhysician[];
  total: number;
  page: number;
  limit: number;
}

// Hook for fetching public physicians
export const usePublicPhysicians = (params?: {
  page?: number;
  limit?: number;
  specialty?: string;
}) => {
  return useQuery({
    queryKey: ['physicians', 'public', params],
    queryFn: async () => {
      const response = await apiClient.get<{
        physicians: ExpertPhysician[];
        total: number;
        page: number;
        limit: number;
      }>('/physician/public', {
        params,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for fetching top-rated physician (single doctor)
export const useTopRatedPhysicians = () => {
  return useQuery({
    queryKey: ['physicians', 'top-rated'],
    queryFn: async () => {
      const response = await apiClient.get<ExpertPhysician>(
        '/physician/top-rated',
      );
      // Ensure we have valid data
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format for top-rated physician');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (
        error &&
        'status' in error &&
        typeof error.status === 'number' &&
        error.status >= 400 &&
        error.status < 500
      ) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
};

// Types for physician statistics
export interface StatisticsResponse {
  data: LandingPageStats;
}

// Hook for fetching physician statistics
export const usePhysicianStatistics = () => {
  return useQuery({
    queryKey: ['physicians', 'statistics'],
    queryFn: async () => {
      const response = await apiClient.get<LandingPageStats>(
        '/physician/statistics',
      );
      // API returns data directly, wrap it in expected format
      return {
        data: response.data,
      };
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false, // Statistics don't need frequent updates
  });
};

// Hook for fetching admin physicians (all physicians for admin management)
export const useAdminPhysicians = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['physicians', 'admin', params],
    queryFn: async () => {
      const response = await apiClient.get<AdminPhysicianResponse>('/physician/getAll', {
        params,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - admin data should be relatively fresh
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
