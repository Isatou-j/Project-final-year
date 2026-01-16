import apiClient from '@/utils/api-client';
import { RegisterPatientRequest, RegisterPhysicianRequest } from '@/types/auth';

export const registerPatient = async (data: RegisterPatientRequest) => {
  try {
    // Log the exact URL being called for debugging
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
    const fullUrl = `${apiUrl}/auth/patient/register`;
    console.log('🔵 Registering patient at:', fullUrl);
    console.log('🔵 API Base URL:', apiUrl);
    console.log('🔵 Registration data:', { ...data, password: '***' });
    
    const response = await apiClient.post('/auth/patient/register', data);
    console.log('✅ Registration successful');
    return response.data;
  } catch (error: any) {
    // Enhanced error logging for debugging
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
    const fullUrl = `${apiUrl}/auth/patient/register`;
    console.error('❌ Registration error details:', {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: fullUrl,
      apiUrl: apiUrl,
      responseData: error?.response?.data,
      isTimeout: error?.code === 'ECONNABORTED' || error?.message?.includes('timeout'),
      isConnectionError: error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND',
      requestConfig: error?.config ? {
        method: error.config.method,
        url: error.config.url,
        baseURL: error.config.baseURL,
        fullUrl: `${error.config.baseURL}${error.config.url}`,
        timeout: error.config.timeout,
      } : null,
    });
    
    // Provide more helpful error messages
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      throw new Error('Connection timeout. The server is taking too long to respond. Please check if the backend is running and accessible.');
    }
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      throw new Error('Cannot connect to server. Please check your API URL configuration and ensure the backend server is running.');
    }
    
    throw error;
  }
};

export const registerPhysician = async (data: RegisterPhysicianRequest) => {
  try {
    // Log the exact URL being called for debugging
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
    const fullUrl = `${apiUrl}/auth/physician/register`;
    console.log('🔵 Registering physician at:', fullUrl);
    console.log('🔵 API Base URL:', apiUrl);
    console.log('🔵 Registration data:', { ...data, password: '***' });
    
    const response = await apiClient.post('/auth/physician/register', data);
    console.log('✅ Registration successful');
    return response.data;
  } catch (error: any) {
    // Enhanced error logging for debugging
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
    const fullUrl = `${apiUrl}/auth/physician/register`;
    console.error('❌ Registration error details:', {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: fullUrl,
      apiUrl: apiUrl,
      responseData: error?.response?.data,
      isTimeout: error?.code === 'ECONNABORTED' || error?.message?.includes('timeout'),
      isConnectionError: error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND',
      requestConfig: error?.config ? {
        method: error.config.method,
        url: error.config.url,
        baseURL: error.config.baseURL,
        fullUrl: `${error.config.baseURL}${error.config.url}`,
        timeout: error.config.timeout,
      } : null,
    });
    
    // Provide more helpful error messages
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      throw new Error('Connection timeout. The server is taking too long to respond. Please check if the backend is running and accessible.');
    }
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      throw new Error('Cannot connect to server. Please check your API URL configuration and ensure the backend server is running.');
    }
    
    throw error;
  }
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
