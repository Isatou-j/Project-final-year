import { z } from 'zod';

export const RegisterUserSchema = z.object({
  username: z.string().min(1, 'Name is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const RegisterPatientSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .transform(val => {
      // Accept DD/MM/YYYY or DD-MM-YYYY format
      const dateRegex = /^(\d{2})[/-](\d{2})[/-](\d{4})$/;
      const match = val.match(dateRegex);
      if (match) {
        const [, day, month, year] = match;
        return new Date(`${year}-${month}-${day}`); // Convert to Date object
      }
      return new Date(val); // Parse as Date if already in correct format
    }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], 'Invalid gender'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
});

export const RegisterPhysicianSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  yearsOfExperience: z
    .number()
    .min(0, 'Years of experience must be non-negative'),
  qualification: z.string().min(1, 'Qualification is required'),
  consultationFee: z
    .number()
    .min(0, 'Consultation fee must be non-negative')
    .optional(),
});

export const VerifyEmailSchema = z.object({
  email: z.email('Invalid email address'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

export const LoginUserSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const RequestVerificationSchema = z.object({
  email: z.email('Invalid email address'),
});

export const RequestPasswordResetSchema = z.object({
  email: z.email('Invalid email address'),
});

export const PasswordResetSchema = z.object({
  email: z.email('Invalid email address'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 8 characters long'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const ResetTokenSchema = z.object({
  resetToken: z.string().min(1, 'Reset token is required'),
});

export const SoftDeleteUserSchema = z.object({
  deletionReason: z.string().optional(),
  password: z.string().min(1, 'Password is required'),
});
