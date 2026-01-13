import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';

export interface Availability {
  id: number;
  physicianId: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export const usePhysicianAvailability = () => {
  return useQuery({
    queryKey: ['availability', 'physician'],
    queryFn: async () => {
      const response = await apiClient.get<Availability[]>(
        '/availability/physician',
      );
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (availabilities: AvailabilityInput[]) => {
      const response = await apiClient.put('/availability/physician', {
        availabilities,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', 'physician'] });
    },
  });
};

export const useUpdateAvailabilityStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isAvailable: boolean) => {
      const response = await apiClient.patch('/availability/physician/status', {
        isAvailable,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['physician', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['availability', 'physician'] });
    },
  });
};

//export type { Availability, AvailabilityInput };

