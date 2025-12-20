import apiClient from '@/utils/api-client';
import { RegisterPatientRequest, RegisterPhysicianRequest } from '@/types/auth';

export const registerPatient = async (data: RegisterPatientRequest) => {
  const response = await apiClient.post('/auth/patient/register', data);
  return response.data;
};

export const registerPhysician = async (data: RegisterPhysicianRequest) => {
  const response = await apiClient.post('/auth/physician/register', data);
  return response.data;
};

export const verifyEmail = async (data: { email: string; code: string }) => {
  const response = await apiClient.post('/auth/verify-email', data);
  return response.data;
};

export const resendVerificationEmail = async (email: string) => {
  const response = await apiClient.post('/auth/request-verification-code', {
    email,
  });
  return response.data;
};

export const approvePhysician = async (physicianId: number) => {
  const response = await apiClient.patch(`/physician/${physicianId}/approve`);
  return response.data;
};

export const rejectPhysician = async (physicianId: number) => {
  const response = await apiClient.patch(`/physician/${physicianId}/reject`);
  return response.data;
};
