import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';

export interface PhysicianAppointment {
  id: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  consultationType: 'VIDEO' | 'AUDIO' | 'CHAT';
  symptoms?: string | null;
  notes?: string | null;
  meetingLink?: string | null;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    user: {
      email: string;
      username: string | null;
    };
  };
  service: {
    id: number;
    name: string;
    description: string;
  };
  payment?: {
    id: number;
    amount: string;
    status: string;
    paymentMethod: string;
  } | null;
}

export const usePhysicianAppointments = () => {
  return useQuery({
    queryKey: ['appointments', 'physician'],
    queryFn: async () => {
      const response = await apiClient.get<PhysicianAppointment[]>(
        '/appointment/physician',
      );
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      status,
    }: {
      appointmentId: number;
      status: string;
    }) => {
      const response = await apiClient.patch(
        `/appointment/${appointmentId}/status`,
        { status },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'physician'] });
    },
  });
};

//export type { PhysicianAppointment };

