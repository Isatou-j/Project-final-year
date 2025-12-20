export interface PatientUser {
  id: number;
  email: string;
  username: string | null;
  isVerified: boolean;
  isActive: boolean;
  profileUrl: string | null;
  createdAt: string;
  lastLogin: string | null;
}

export interface Patient {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string | null;
  bloodType: string | null;
  allergies: string | null;
  medicalHistory: string | null;
  createdAt: string;
  updatedAt: string;
  user: PatientUser;
}

export interface PatientResponse {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
}

