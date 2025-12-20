import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';

export interface PatientProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact?: string | null;
  bloodType?: string | null;
  allergies?: string | null;
  medicalHistory?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    email: string;
    username?: string | null;
    profileUrl?: string | null;
    isVerified: boolean;
    isActive: boolean;
  };
}

export interface UpdatePatientProfilePayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}

export const usePatientProfile = () => {
  return useQuery({
    queryKey: ['patient', 'profile'],
    queryFn: async () => {
      const response = await apiClient.get<PatientProfile>('/patient/profile');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdatePatientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePatientProfilePayload) => {
      const response = await apiClient.put<PatientProfile>(
        '/patient/profile',
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'profile'] });
    },
  });
};

