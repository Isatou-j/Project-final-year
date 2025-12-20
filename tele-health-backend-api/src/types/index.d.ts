import { Gender, Role } from "../prisma/generated/prisma";
import { User } from "./user";

export interface AuthInput {
    email: string;
    password: string;
}

export interface UserCreateInput {
    username?: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface TokenPayload {
    id: number;
    username?: string;
    email: string;
    role: string;
}

export interface EmailVerification {
  id: number;
  userId: number;
  code: string;
  expiresAt: Date;
  createdAt: Date;
  user: User;
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

export interface RegisterAdminRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  username?: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface RequestVerificationRequest {
  email: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface PasswordResetRequest {
  email: string;
  newPassword: string;
  resetToken: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AdminProfile;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface LoginUser {
  id: number;
  name: string | null;
  email: string;
  profileUrl?: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface UserProfile {
  id: number;
  username?: string;
  email: string;
  role: Role;
  profileUrl?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  username?: string;
  phone?: string;
  address?: string;
  profileUrl?: string;
}

export interface CreatePinRequest {
  pin: string;
  confirmPin: string;
}

export interface ChangePinRequest {
  oldPin: string;
  newPin: string;
}

export interface EnableBiometricsRequest {
  enabled: boolean;
}


export interface RegisterPatientData {
  email: string;
  password: string;
  username?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string;
  gender: Gender;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PatientProfile {
  id: number;
  username?: string;
  email: string;
  role: Role;
  fullName: string;
  dateOfBirth: Date | string;
  gender: Gender;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profileUrl?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface RegisterPhysicianData {
  email: string;
  password: string;
  username?: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  qualification: string;
  bio?: string;
  consultationFee?: number;
}

export interface PhysicianProfile {
  id: number;
  username?: string;
  email: string;
  role: Role;
  fullName: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  qualification: string;
  bio?: string;
  consultationFee?: number;
  profileUrl?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfile {
  id: number;
  username?: string;
  email: string;
  role: Role;
  fullName?: string;
  profileUrl?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}



//Payment types 

import { PaymentMethod, PaymentStatus, InvoiceStatus } from "../prisma/generated/prisma";

export interface PaymentRequest {
  appointmentId: number;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status?: PaymentStatus;
}

export interface CreatePaymentRequest {
  appointmentId: number;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
}

export interface UpdatePaymentRequest {
  status?: PaymentStatus;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
}

export interface PaymentResponse {
  id: number;
  appointmentId: number;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  invoice?: InvoiceResponse;
}

export interface CreateInvoiceRequest {
  paymentId: number;
  totalAmount: number;
  tax: number;
  discount: number;
  dueDate: string;
}

export interface UpdateInvoiceRequest {
  status?: InvoiceStatus;
  tax?: number;
  discount?: number;
  dueDate?: string;
}

export interface InvoiceResponse {
  id: number;
  paymentId: number;
  invoiceNo: string;
  totalAmount: number;
  tax: number;
  discount: number;
  issuedAt: string;
  dueDate: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
  receipt?: ReceiptResponse;
}

export interface CreateReceiptRequest {
  invoiceId: number;
  receivedBy?: string;
  notes?: string;
}

export interface UpdateReceiptRequest {
  receivedBy?: string;
  notes?: string;
}

export interface ReceiptResponse {
  id: number;
  invoiceId: number;
  receiptNo: string;
  issuedAt: string;
  receivedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptRequest{
  invoiceId: number;
  receiptNo: string;
  issuedAt: Date;
  receivedBy?: string;
  notes?: string;
}