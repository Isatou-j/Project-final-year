export interface Service {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    appointments: number;
  };
}

export interface ServiceResponse {
  services: Service[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateServicePayload {
  name: string;
  description: string;
  icon?: string;
  isActive?: boolean;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

