import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import type { Service, ServiceResponse, CreateServicePayload, UpdateServicePayload } from '@/types/service';

// Hook for fetching admin services
export const useAdminServices = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}) => {
  return useQuery({
    queryKey: ['services', 'admin', params],
    queryFn: async () => {
      const response = await apiClient.get<ServiceResponse>('/service/getAll', {
        params,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for creating a service
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateServicePayload) => {
      const response = await apiClient.post('/service/create', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', 'admin'] });
    },
  });
};

// Hook for updating a service
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateServicePayload }) => {
      const response = await apiClient.put(`/service/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', 'admin'] });
    },
  });
};

// Hook for deleting a service
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/service/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', 'admin'] });
    },
  });
};

export type {
  Service,
  ServiceResponse,
  CreateServicePayload,
  UpdateServicePayload,
};

