import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getSession, signOut } from 'next-auth/react';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

// Log API URL configuration (only in browser, not during SSR)
if (typeof window !== 'undefined') {
  console.log('API Client initialized with BASE_URL:', BASE_URL);
  
  // Warn if using default localhost URL in production
  if (BASE_URL.includes('localhost') && process.env.NODE_ENV === 'production') {
    console.warn(
      '⚠️ WARNING: Using localhost API URL in production!',
      'Set NEXT_PUBLIC_API_URL environment variable to your production API URL.'
    );
  }
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout for API requests
      validateStatus: (status) => {
        // Don't throw errors for 4xx/5xx responses
        return status >= 200 && status < 600;
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        
        // Log request URL for debugging (only in development)
        if (process.env.NODE_ENV === 'development') {
          console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            fullUrl: `${config.baseURL}${config.url}`,
          });
        }
        
        return config;
      },
      error => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async error => {
        const originalRequest = error.config;

        // Enhanced error logging for 404s
        if (error.response?.status === 404) {
          console.error('❌ 404 Not Found:', {
            url: error.config?.url,
            fullUrl: `${error.config?.baseURL}${error.config?.url}`,
            method: error.config?.method?.toUpperCase(),
            baseURL: error.config?.baseURL,
            message: 'The API endpoint was not found. Check your NEXT_PUBLIC_API_URL environment variable.',
          });
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If refresh is in progress, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.client(originalRequest);
              })
              .catch(err => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            this.processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            await signOut({ callbackUrl: '/login' });
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private async refreshToken(): Promise<string> {
    try {
      const session = await getSession();
      if (!session?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post('/api/v1/auth/refresh-token', {
        refreshToken: session.refreshToken,
      });

      const { accessToken } = response.data;

      // Update the session with new token
      // Note: This might require triggering a session update
      // For now, we'll return the new token and rely on the interceptor

      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });

    this.failedQueue = [];
  }

  public get instance(): AxiosInstance {
    return this.client;
  }

  // Convenience methods
  public get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  public delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }

  public patch<T = any>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config);
  }

  // Get current user
  public getCurrentUser() {
    return this.client.get<{
      success: boolean;
      data: {
        user: {
          id: string;
          name: string;
          email: string;
          role: 'ADMIN' | 'PATIENT' | 'PHYSICIAN';
          profileUrl: string;
          isVerified: boolean;
          isActive: boolean;
          createdAt: string;
          updatedAt: string;
        };
      };
    }>('/user/me');
  }
}

const apiClient = new ApiClient();

export default apiClient;
