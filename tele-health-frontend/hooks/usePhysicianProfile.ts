import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';

export interface PhysicianProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  qualification: string;
  bio: string | null;
  profileImage: string | null;
  consultationFee: number;
  status: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    email: string;
    username: string | null;
    profileUrl: string | null;
    isVerified: boolean;
    isActive: boolean;
  };
}

export const usePhysicianProfile = () => {
  return useQuery({
    queryKey: ['physician', 'profile'],
    queryFn: async () => {
      const response = await apiClient.get<PhysicianProfile>('/physician/profile');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdatePhysicianProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<PhysicianProfile>) => {
      const response = await apiClient.put('/physician/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['physician', 'profile'] });
    },
  });
};

//export type { PhysicianProfile };

