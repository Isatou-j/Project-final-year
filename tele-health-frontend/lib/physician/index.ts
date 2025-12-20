import { PhysicianResponse } from '@/types/physician';
import apiClient from '@/utils/api-client';

export const getAllAdminPhysicians = async (): Promise<PhysicianResponse> => {
  const response = await apiClient.get('/physician/getAll');
  return response.data;
};
