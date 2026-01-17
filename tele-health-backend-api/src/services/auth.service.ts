/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from '../lib/prisma';
import {
  AuthenticationError,
  ConflictError,
} from '../middleware/error.middleware';
import { Role } from '../prisma/generated/prisma';
import {
  UserCreateInput,
  AuthResponse,
  RegisterPatientData,
  PatientProfile,
  RegisterPhysicianData,
  PhysicianProfile,
  LoginResponse,
} from '../types';
import { hashPassword } from '../utils/hash';
import { getRelativeExpiry } from '../utils/helper';
import { generateRefreshToken, generateToken } from '../utils/jwt';
import { generateResetToken } from '../utils/token-generator';
import { generateVerificationCode } from '../utils/verification-code-generator';
import {
  sendEmail,
  sendWelcomeEmail,
  sendPhysicianApprovalEmail,
  sendPasswordResetEmail,
} from './email.service';

const CODE_EXPIRATION_MINUTES = 14;

export const registerPatient = async (
  data: RegisterPatientData,
): Promise<AuthResponse> => {
  const { username, email, password, ...rest } = data;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError('A user with this email already exists');
  }

  const hashed = await hashPassword(password);

  const user = await prisma.$transaction(async tx => {
    const newUser = await tx.user.create({
      data: {
        username,
        email,
        password: hashed,
        role: Role.PATIENT,
        isVerified: false,
      },
    });

    const patient = await tx.patient.create({
      data: {
        userId: newUser.id,
        ...rest,
      },
    });

    return { newUser, patient };
  });

  const code = generateVerificationCode();
  const expiresAt = new Date(
    Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
  );

  await prisma.emailVerification.upsert({
    where: { userId: user.newUser.id },
    update: { code, expiresAt, createdAt: new Date() },
    create: { userId: user.newUser.id, code, expiresAt },
  });

  const expiryTime = getRelativeExpiry(expiresAt);

  try {
    await sendEmail({
      to: user.newUser.email,
      subject: 'Your Verification Code',
      text: 'verification code',
      code: code,
      expiresAt: expiryTime,
    });
    console.log('✅ Verification email sent to patient:', user.newUser.email);
  } catch (emailError: any) {
    console.error('❌ Failed to send verification email during patient registration:', {
      email: user.newUser.email,
      error: emailError?.message,
      stack: emailError?.stack,
    });
    // Continue with registration even if email fails
    // User can request a new code later
  }

  const accessToken = generateToken({
    id: user.newUser.id,
    username: user.newUser.username ?? undefined,
    email: user.newUser.email,
    role: user.newUser.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.newUser.id,
    username: user.newUser.username ?? undefined,
    email: user.newUser.email,
    role: user.newUser.role,
  });

  await prisma.session.create({
    data: {
      userId: user.newUser.id,
      refreshToken,
      expiresAt: new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
      ),
    },
  });

  const userProfile: PatientProfile = {
    id: user.newUser.id,
    fullName: user.patient.firstName + ' ' + user.patient.lastName,
    username: user.newUser.username ?? undefined,
    email: user.newUser.email,
    address: user.patient.address,
    city: user.patient.city,
    state: user.patient.state,
    zipCode: user.patient.zipCode,
    dateOfBirth: user.patient.dateOfBirth,
    gender: user.patient.gender,
    phoneNumber: user.patient.phoneNumber,
    role: user.newUser.role,
    profileUrl: user.newUser.profileUrl || undefined,
    isVerified: user.newUser.isVerified,
    createdAt: user.newUser.createdAt.toISOString(),
    updatedAt: user.newUser.updatedAt.toISOString(),
  };

  return {
    success: true,
    message:
      'Patient registered successfully. Verification code sent to email.',
    data: {
      user: userProfile,
      accessToken,
      refreshToken,
      expiresIn: '15m',
    },
  };
};

export const registerPhysician = async (
  data: RegisterPhysicianData,
): Promise<AuthResponse> => {
  const { username, email, password, ...rest } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError('A user with this email already exists');
  }

  const existingLicense = await prisma.physician.findUnique({
    where: { licenseNumber: data.licenseNumber },
  });
  if (existingLicense) {
    throw new ConflictError(
      'A physician with this license number already exists',
    );
  }

  const hashed = await hashPassword(password);

  const user = await prisma.$transaction(async tx => {
    const newUser = await tx.user.create({
      data: {
        username,
        email,
        password: hashed,
        role: Role.PHYSICIAN,
        isVerified: false,
      },
    });

    const physician = await tx.physician.create({
      data: {
        userId: newUser.id,
        ...rest,
        consultationFee: rest.consultationFee || 0,
        status: 'PENDING',
        isAvailable: false,
      },
    });

    return { newUser, physician };
  });

  const code = generateVerificationCode();
  const expiresAt = new Date(
    Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
  );

  await prisma.emailVerification.upsert({
    where: { userId: user.newUser.id },
    update: { code, expiresAt, createdAt: new Date() },
    create: { userId: user.newUser.id, code, expiresAt },
  });

  const expiryTime = getRelativeExpiry(expiresAt);

  try {
    await sendEmail({
      to: user.newUser.email,
      subject: 'Your Verification Code',
      text: 'verification code',
      code: code,
      expiresAt: expiryTime,
    });
    console.log('✅ Verification email sent to physician:', user.newUser.email);
  } catch (emailError: any) {
    console.error('❌ Failed to send verification email during physician registration:', {
      email: user.newUser.email,
      error: emailError?.message,
      stack: emailError?.stack,
    });
    // Continue with registration even if email fails
    // User can request a new code later
  }

  const accessToken = generateToken({
    id: user.newUser.id,
    username: user.newUser.username ?? undefined,
    email: user.newUser.email,
    role: user.newUser.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.newUser.id,
    username: user.newUser.username ?? undefined,
    email: user.newUser.email,
    role: user.newUser.role,
  });

  await prisma.session.create({
    data: {
      userId: user.newUser.id,
      refreshToken,
      expiresAt: new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
      ),
    },
  });

  const userProfile: PhysicianProfile = {
    id: user.newUser.id,
    fullName: user.physician.firstName + ' ' + user.physician.lastName,
    username: user.newUser.username ?? undefined,
    email: user.newUser.email,
    role: user.newUser.role,
    specialization: user.physician.specialization,
    licenseNumber: user.physician.licenseNumber,
    qualification: user.physician.qualification,
    bio: user.physician.bio || undefined,
    consultationFee: Number(user.physician.consultationFee) ?? undefined,
    yearsOfExperience: user.physician.yearsOfExperience,
    profileUrl: user.newUser.profileUrl || undefined,
    isVerified: user.newUser.isVerified,
    createdAt: user.newUser.createdAt.toISOString(),
    updatedAt: user.newUser.updatedAt.toISOString(),
  };

  return {
    success: true,
    message: 'Physician registered successfully. Pending admin approval.',
    data: {
      user: userProfile,
      accessToken,
      refreshToken,
      expiresIn: '15m',
    },
  };
};

export const registerAdmin = async (
  data: UserCreateInput,
): Promise<AuthResponse> => {
  const { username, email, password, firstName, lastName } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError('An admin with this email already exists');
  }

  const hashed = await hashPassword(password);

  const adminUser = await prisma.$transaction(async tx => {
    const newUser = await tx.user.create({
      data: {
        username,
        email,
        password: hashed,
        role: Role.ADMIN,
        isVerified: true,
      },
    });

    const admin = await tx.admin.create({
      data: {
        userId: newUser.id,
        firstName: firstName || 'Admin',
        lastName: lastName || 'User',
      },
    });

    return { newUser, admin };
  });

  const token = generateToken({
    id: adminUser.newUser.id,
    username: adminUser.newUser.username ?? undefined,
    email: adminUser.newUser.email,
    role: adminUser.newUser.role,
  });

  const refreshToken = generateRefreshToken({
    id: adminUser.newUser.id,
    username: adminUser.newUser.username ?? undefined,
    email: adminUser.newUser.email,
    role: adminUser.newUser.role,
  });

  await prisma.session.create({
    data: {
      userId: adminUser.newUser.id,
      refreshToken,
      expiresAt: new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
      ),
    },
  });

  return {
    success: true,
    message: 'Admin registered successfully.',
    data: {
      user: {
        id: adminUser.newUser.id,
        fullName: adminUser.admin.firstName + ' ' + adminUser.admin.lastName,
        username: adminUser.newUser.username ?? undefined,
        email: adminUser.newUser.email,
        role: adminUser.newUser.role,
        profileUrl: adminUser.newUser.profileUrl || undefined,
        isVerified: adminUser.newUser.isVerified,
        createdAt: adminUser.newUser.createdAt.toISOString(),
        updatedAt: adminUser.newUser.updatedAt.toISOString(),
      },
      accessToken: token,
      refreshToken,
      expiresIn: '15m',
    },
  };
};

export const loginAdmin = async (email: string): Promise<LoginResponse> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      patient: false,
      physician: true,
      admin: true,
    },
  });

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated');
  }

  if (!user.isVerified) {
    throw new AuthenticationError(
      'Email not verified. Please verify your email first.',
    );
  }

  if (user.role === Role.PHYSICIAN && user.physician?.status !== 'APPROVED') {
    throw new AuthenticationError(
      `Your account is ${user.physician?.status.toLowerCase()}. Please wait for admin approval.`,
    );
  }

  const accessToken = generateToken({
    id: user.id,
    username: user.username ?? undefined,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    username: user.username ?? undefined,
    email: user.email,
    role: user.role,
  });

  await prisma.session.upsert({
    where: { userId: user.id },
    update: {
      refreshToken,
      revokedAt: null,
      expiresAt: new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
      ),
    },
    create: {
      userId: user.id,
      refreshToken,
      expiresAt: new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
      ),
    },
  });

  return {
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.admin
          ? user.admin.firstName + ' ' + user.admin.lastName
          : null,
        email: user.email,
        profileUrl: user.profileUrl || undefined,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      accessToken,
      refreshToken,
      expiresIn: '15m',
    },
  };
};

export const loginPhysician = async (email: string): Promise<LoginResponse> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      patient: true,
      physician: true,
      admin: false,
    },
  });

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated');
  }

  if (!user.isVerified) {
    throw new AuthenticationError(
      'Email not verified. Please verify your email first.',
    );
  }

  if (user.role === Role.PHYSICIAN && user.physician?.status !== 'APPROVED') {
    throw new AuthenticationError(
      `Your account is ${user.physician?.status.toLowerCase()}. Please wait for admin approval.`,
    );
  }

  let userProfile;

  if (!user.physician) {
    userProfile = await prisma.physician.findUnique({
      where: { userId: user.id },
    });
  }

  const accessToken = generateToken({
    id: user.id,
    username: user.username ?? undefined,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    username: user.username ?? undefined,
    email: user.email,
    role: user.role,
  });

  await prisma.session.upsert({
    where: { userId: user.id },
    update: {
      refreshToken,
      revokedAt: null,
      expiresAt: new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
      ),
    },
    create: {
      userId: user.id,
      refreshToken,
      expiresAt: new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
      ),
    },
  });

  return {
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.physician
          ? user.physician.firstName + ' ' + user.physician.lastName
          : userProfile?.firstName + ' ' + userProfile?.lastName,
        email: user.email,
        profileUrl: user.profileUrl || undefined,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      accessToken,
      refreshToken,
      expiresIn: '15m',
    },
  };
};

export const loginPatient = async (email: string): Promise<LoginResponse> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      patient: true,
      physician: false,
      admin: false,
    },
  });

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated');
  }

  if (!user.isVerified) {
    throw new AuthenticationError(
      'Email not verified. Please verify your email first.',
    );
  }

  const accessToken = generateToken({
    id: user.id,
    username: user.username ?? undefined,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    username: user.username ?? undefined,
    email: user.email,
    role: user.role,
  });

  await prisma.session.upsert({
    where: { userId: user.id },
    update: {
      refreshToken,
      revokedAt: null,
      expiresAt: new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
      ),
    },
    create: {
      userId: user.id,
      refreshToken,
      expiresAt: new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
      ),
    },
  });

  return {
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.patient
          ? user.patient.firstName + ' ' + user.patient.lastName
          : null,
        email: user.email,
        profileUrl: user.profileUrl || undefined,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      accessToken,
      refreshToken,
      expiresIn: '15m',
    },
  };
};

export const verifyUserEmail = async (
  userId: number,
  code: string,
): Promise<AuthResponse> => {
  const record = await prisma.emailVerification.findFirst({
    where: { userId, code },
  });

  if (!record) {
    throw new AuthenticationError('Invalid verification code');
  }

  if (record.expiresAt < new Date()) {
    throw new AuthenticationError('Verification code expired');
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true, verifiedAt: new Date() },
    include: {
      patient: true,
      physician: true,
      admin: true,
    },
  });

  await prisma.emailVerification.delete({ where: { id: record.id } });

  const roleName =
    user.role === Role.PATIENT
      ? 'PATIENT'
      : user.role === Role.PHYSICIAN
        ? 'PHYSICIAN'
        : 'ADMIN';
  const userName =
    user.patient?.firstName + ' ' + user.patient?.lastName ||
    user.physician?.firstName + ' ' + user.physician?.lastName ||
    user.admin?.firstName + ' ' + user.admin?.lastName ||
    user.username ||
    'User';

  await sendWelcomeEmail(user.email, userName, roleName);

  const accessToken = generateToken({
    id: user.id,
    username: user.username ?? undefined,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    username: user.username ?? undefined,
    email: user.email,
    role: user.role,
  });

  await prisma.session.upsert({
    where: { userId: user.id },
    update: {
      refreshToken,
      revokedAt: null,
      expiresAt: new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
      ),
    },
    create: {
      userId: user.id,
      refreshToken,
      expiresAt: new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
      ),
    },
  });

  return {
    success: true,
    message: 'Email verified successfully',
    data: {
      user: {
        id: user.id,
        username: user.username ?? undefined,
        email: user.email,
        role: user.role,
        profileUrl: user.profileUrl || undefined,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      accessToken,
      refreshToken,
      expiresIn: '15m',
    },
  };
};

export const requestVerificationCode = async (
  userId: number,
  email: string,
): Promise<void> => {
  const code = generateVerificationCode();
  const expiresAt = new Date(
    Date.now() + CODE_EXPIRATION_MINUTES * 24 * 60 * 60 * 1000,
  );

  await prisma.emailVerification.upsert({
    where: { userId },
    update: { code, expiresAt, createdAt: new Date() },
    create: { userId, code, expiresAt },
  });

  const expiryTime = getRelativeExpiry(expiresAt);

  try {
    await sendEmail({
      to: email,
      subject: 'Your Verification Code',
      text: 'verification code',
      code: code,
      expiresAt: expiryTime,
    });
    console.log('✅ Verification code email sent to:', email);
  } catch (emailError: any) {
    console.error('❌ Failed to send verification code email:', {
      email,
      error: emailError?.message,
      stack: emailError?.stack,
    });
    throw new Error('Failed to send verification code. Please check your email configuration.');
  }
};

export const requestPasswordReset = async (
  userId: number,
  email: string,
): Promise<void> => {
  const resetToken = generateResetToken(6);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.passwordResetToken.upsert({
    where: { userId },
    update: { resetToken, expiresAt },
    create: { userId, resetToken, expiresAt },
  });

  await sendPasswordResetEmail(email, resetToken);
};

export const validateResetToken = async (token: string): Promise<boolean> => {
  const record = await prisma.passwordResetToken.findFirst({
    where: { resetToken: token, expiresAt: { gt: new Date() } },
  });

  if (!record) {
    throw new Error('Invalid reset token');
  }

  if (record.expiresAt < new Date()) {
    throw new Error('Reset token expired');
  }

  return !!record.resetToken;
};

export const resetPassword = async (
  userId: number,
  newPassword: string,
): Promise<any> => {
  const storedToken = await prisma.passwordResetToken.findFirst({
    where: { userId },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired reset token');
  }

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed, passwordUpdatedAt: new Date() },
  });

  await prisma.passwordResetToken.delete({ where: { userId } });
};

export const changePassword = async (
  userId: number,
  newPassword: string,
): Promise<void> => {
  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed, passwordUpdatedAt: new Date() },
  });
};

export const approvePhysician = async (
  physicianId: number,
  approved: boolean,
): Promise<void> => {
  const physician = await prisma.physician.findUnique({
    where: { id: physicianId },
    include: { user: true },
  });

  if (!physician) {
    throw new Error('Physician not found');
  }

  await prisma.physician.update({
    where: { id: physicianId },
    data: {
      status: approved ? 'APPROVED' : 'REJECTED',
      isAvailable: approved,
    },
  });

  const physicianName = `${physician.firstName} ${physician.lastName}`;
  await sendPhysicianApprovalEmail(
    physician.user.email,
    physicianName,
    approved,
  );
};

export const userExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return !!user;
};

export const findOneByEmail = async (email: string): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      patient: true,
      physician: true,
      admin: true,
    },
  });
  return user;
};

export const findOneById = async (userId: number): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      patient: true,
      physician: true,
      admin: true,
    },
  });
  return user;
};

export const logoutService = async (userId: number): Promise<void> => {
  const session = await prisma.session.findUnique({
    where: { userId },
  });

  if (!session) {
    throw new Error('Session not found');
  }

  const now = new Date();

  if (session.expiresAt <= now) {
    await prisma.session.update({
      where: { userId },
      data: { revokedAt: now, revoked: true },
    });
    throw new Error('Token already expired');
  }

  await prisma.session.update({
    where: { userId },
    data: { revokedAt: now, revoked: true },
  });
};

export const softDeleteUser = async (
  userId: number,
  deletionReason: string = 'USER_REQUESTED',
) => {
  const timestamp = Date.now();
  const anonymizedEmail = `deleted_${timestamp}_${userId.toString().slice(-6)}@deleted.com`;

  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      email: anonymizedEmail,
      isActive: false,
      deletionReason,
    },
    select: {
      id: true,
      email: true,
      isActive: true,
      deletedAt: true,
      deletionReason: true,
    },
  });

  return result;
};

export const restoreUser = async (userId: number) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: null,
      isActive: true,
      deletionReason: null,
    },
    select: {
      id: true,
      email: true,
      isActive: true,
      deletedAt: true,
      deletionReason: true,
    },
  });

  return result;
};
