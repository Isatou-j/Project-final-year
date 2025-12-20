import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';

export type ConsultationType = 'VIDEO' | 'AUDIO' | 'CHAT';

export interface BookAppointmentPayload {
  physicianId: number;
  serviceId: number;
  appointmentDate: string; // ISO string
  startTime: string; // ISO string
  endTime: string; // ISO string
  consultationType: ConsultationType;
  symptoms?: string;
}

export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BookAppointmentPayload) => {
      const response = await apiClient.post('/appointment/book', data);
      return response.data;
    },
    onSuccess: () => {
      // Refresh any appointment-related queries
      queryClient.invalidateQueries({ queryKey: ['appointments', 'patient'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export interface Appointment {
  id: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  consultationType: ConsultationType;
  symptoms?: string;
  physician?: {
    id: number;
    firstName?: string;
    lastName?: string;
    specialization?: string;
  };
  service?: {
    id: number;
    name: string;
  };
  payment?: {
    amount: string;
    status: 'PAID' | 'PENDING' | 'FAILED';
  };
}

export const usePatientAppointments = () => {
  return useQuery({
    queryKey: ['appointments', 'patient'],
    queryFn: async () => {
      const response = await apiClient.get<{ appointments: Appointment[] }>(
        '/appointment/patient',
      );
      return response.data.appointments ?? response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export interface AdminAppointment {
  id: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  consultationType: ConsultationType;
  symptoms?: string | null;
  notes?: string | null;
  meetingLink?: string | null;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    user: {
      email: string;
      username: string | null;
    };
  };
  physician: {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
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

export interface AdminAppointmentsResponse {
  appointments: AdminAppointment[];
  total: number;
  page: number;
  limit: number;
}

export const useAdminAppointments = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['appointments', 'admin', params],
    queryFn: async () => {
      const response = await apiClient.get<AdminAppointmentsResponse>(
        '/appointment/getAll',
        {
          params,
        },
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - admin data should be relatively fresh
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};


