import { useQuery } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import type { PatientResponse, Patient } from '@/types/patient';

// Hook for fetching admin patients (all patients for admin management)
export const useAdminPatients = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['patients', 'admin', params],
    queryFn: async () => {
      const response = await apiClient.get<PatientResponse>('/patient/getAll', {
        params,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - admin data should be relatively fresh
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export type { PatientResponse, Patient };

