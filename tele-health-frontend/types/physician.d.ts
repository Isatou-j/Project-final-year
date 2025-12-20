export interface PhysicianResponse {
  physicians: Physician[];
  total: number;
  page: number;
  limit: number;
}

export interface Physician {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  status: PhysicianStatus;
  user: PhysicianUser;
}

export interface PhysicianUser {
  email: string;
  username: string;
}

export type PhysicianStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'SUSPENDED';
