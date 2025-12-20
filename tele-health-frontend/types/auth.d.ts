export type Role = 'ADMIN' | 'PATIENT' | 'PHYSICIAN';

export interface LoginUser {
  id: number;
  name: string;
  email: string;
  profileUrl: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  isBiometricsEnabled: boolean;
  createdAt: string; // ✅ Added
  updatedAt: string; // ✅ Added
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: LoginUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface RegisterPatientRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface RegisterPhysicianRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  qualification: string;
  consultationFee?: number;
}

export interface RegisterAdminInput {
  username?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
