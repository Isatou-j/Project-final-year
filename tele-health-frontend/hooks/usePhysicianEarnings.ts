import { useQuery } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';

export interface PhysicianPayment {
  id: number;
  amount: string;
  currency: string;
  paymentMethod: string;
  status: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
  appointment: {
    appointmentDate: string;
    patient: {
      id: number;
      firstName: string;
      lastName: string;
      user: {
        email: string;
        username: string | null;
      };
    };
    service: {
      id: number;
      name: string;
    };
  };
  invoice?: {
    id: number;
    invoiceNo: string;
    totalAmount: string;
    status: string;
  } | null;
}

export interface PhysicianEarnings {
  totalEarnings: number;
  totalTransactions: number;
  monthlyEarnings: Record<string, number>;
  payments: PhysicianPayment[];
}

export const usePhysicianPayments = () => {
  return useQuery({
    queryKey: ['payments', 'physician'],
    queryFn: async () => {
      const response = await apiClient.get<PhysicianPayment[]>(
        '/payment/physician',
      );
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const usePhysicianEarnings = () => {
  return useQuery({
    queryKey: ['earnings', 'physician'],
    queryFn: async () => {
      const response = await apiClient.get<PhysicianEarnings>(
        '/payment/physician/earnings',
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export type { PhysicianPayment, PhysicianEarnings };

