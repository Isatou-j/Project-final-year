import { useQuery } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';

export interface MedicalRecord {
  id: number;
  patientId: number;
  documentName: string;
  documentType: string;
  fileUrl: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: number;
    firstName: string;
    lastName: string;
    user?: {
      id: number;
      email: string;
    };
  };
}

export interface MedicalRecordsResponse {
  data: MedicalRecord[];
  message?: string;
}

export const usePatientMedicalRecords = () => {
  return useQuery({
    queryKey: ['medical-records', 'patient'],
    queryFn: async () => {
      const response = await apiClient.get<MedicalRecordsResponse>(
        '/patient/medical-records',
      );
      return response.data.data ?? response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

