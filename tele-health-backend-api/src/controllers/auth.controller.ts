/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

import prisma from '../lib/prisma';
import * as authService from '../services/auth.service';
import { comparePassword } from '../utils/hash';
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from '../utils/jwt';
import {
  ChangePasswordSchema,
  LoginUserSchema,
  PasswordResetSchema,
  RegisterPatientSchema,
  RegisterPhysicianSchema,
  RegisterUserSchema,
  RequestPasswordResetSchema,
  RequestVerificationSchema,
  ResetTokenSchema,
  SoftDeleteUserSchema,
  VerifyEmailSchema,
} from '../validators/auth.schema';
import { Role } from '../prisma/generated/prisma';

export const registerPatientController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    console.log('\n📝 ============================================');
    console.log('📝 PATIENT REGISTRATION REQUEST');
    console.log('📝 ============================================');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('📝 ============================================\n');

    const patientData = RegisterPatientSchema.parse(req.body);

    const userExist = await authService.userExists(patientData.email);
    if (userExist) {
      console.log('❌ User already exists:', patientData.email);
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const response = await authService.registerPatient(patientData);

    return res.status(201).json(response);
  } catch (error: any) {
    // Log validation errors for debugging
    if (error.name === 'ZodError') {
      console.error('\n❌ ============================================');
      console.error('❌ VALIDATION ERROR IN PATIENT REGISTRATION');
      console.error('❌ ============================================');
      console.error('Request Body:', JSON.stringify(req.body, null, 2));
      console.error('Validation Errors:');
      error.issues.forEach((issue: any, index: number) => {
        console.error(`  ${index + 1}. ${issue.path.join('.')}: ${issue.message}`);
      });
      console.error('❌ ============================================\n');
    }
    next(error);
  }
};

export const registerPhysicianController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    // Log incoming data for debugging
    console.log('Received physician registration data:', req.body);
    
    const physicianData = RegisterPhysicianSchema.parse(req.body);

    const userExist = await authService.userExists(physicianData.email);
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const response = await authService.registerPhysician(physicianData);

    return res.status(201).json(response);
  } catch (error: any) {
    // Log validation errors for debugging
    if (error.name === 'ZodError') {
      console.error('Zod validation error:', error.issues);
    }
    next(error);
  }
};

export const registerAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const adminData = RegisterUserSchema.parse(req.body);

    const userExist = await authService.userExists(adminData.email);
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const response = await authService.registerAdmin(adminData);

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email, password } = LoginUserSchema.parse(req.body);

    const userExist = await authService.findOneByEmail(email);

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!(await comparePassword(password, userExist.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials, your email or password is not correct.',
      });
    }

    let response;

    // Route to appropriate login service based on user role
    switch (userExist.role) {
      case Role.ADMIN:
        response = await authService.loginAdmin(email);
        break;
      case Role.PHYSICIAN:
        response = await authService.loginPhysician(email);
        break;
      case Role.PATIENT:
        response = await authService.loginPatient(email);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role',
        });
    }

    res.cookie('refreshToken', response.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const loginAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email, password } = LoginUserSchema.parse(req.body);

    const userExist = await authService.findOneByEmail(email);

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!(await comparePassword(password, userExist.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials, your email or password is not correct.',
      });
    }

    const response = await authService.loginAdmin(email);

    res.cookie('refreshToken', response.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      response,
    });
  } catch (error) {
    next(error);
  }
};

export const loginPatientController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email, password } = LoginUserSchema.parse(req.body);

    const userExist = await authService.findOneByEmail(email);

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!(await comparePassword(password, userExist.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials, your email or password is not correct.',
      });
    }

    const response = await authService.loginPatient(email);

    res.cookie('refreshToken', response.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const loginPhysicianController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email, password } = LoginUserSchema.parse(req.body);

    const userExist = await authService.findOneByEmail(email);

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!(await comparePassword(password, userExist.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials, your email or password is not correct.',
      });
    }

    const response = await authService.loginPhysician(email);

    res.cookie('refreshToken', response.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email, code } = VerifyEmailSchema.parse(req.body);

    const userExist = await authService.findOneByEmail(email);

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const response = await authService.verifyUserEmail(userExist.id, code);

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required',
      });
    }

    const payload = verifyRefreshToken(refreshToken) as any;

    const newAccessToken = generateToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });

    const newRefreshToken = generateRefreshToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });

    await prisma.session.update({
      where: { userId: payload.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        expiresIn: '15m',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const requestVerificationCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email } = RequestVerificationSchema.parse(req.body);
    const userExist = await authService.findOneByEmail(email);

    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist, try again.',
      });
    }

    if (userExist.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'User already verified',
      });
    }

    await authService.requestVerificationCode(userExist.id, email);

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email.',
    });
  } catch (error) {
    next(error);
  }
};

export const requestPasswordResetController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email } = RequestPasswordResetSchema.parse(req.body);

    const userExist = await authService.findOneByEmail(email);

    if (!userExist) {
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a reset token has been sent.',
      });
    }

    await authService.requestPasswordReset(userExist.id, email);

    res.status(200).json({
      success: true,
      message: 'Password reset token sent to your email',
    });
  } catch (error) {
    next(error);
  }
};

export const validateResetTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { resetToken } = ResetTokenSchema.parse(req.body);

    const result = await authService.validateResetToken(resetToken);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token, try again.',
      });
    }

    res.status(200).json({
      success: true,
      valid: result,
      message: 'Reset token validated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const passwordResetController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email, newPassword } = PasswordResetSchema.parse(req.body);

    const userExist = await authService.findOneByEmail(email);

    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist, try again.',
      });
    }

    await authService.resetPassword(userExist.id, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully, try login.',
    });
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { oldPassword, newPassword } = ChangePasswordSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated.',
      });
    }

    const userExist = await authService.findOneById(userId);

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const isOldPasswordValid = await comparePassword(
      oldPassword,
      userExist.passwordHash,
    );

    if (!isOldPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    const isSamePassword = await comparePassword(
      newPassword,
      userExist.passwordHash,
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password.',
      });
    }

    await authService.changePassword(userId, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid input data.',
        errors: error.message,
      });
    }

    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await authService.logoutService(userId);

    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const user = await authService.findOneById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { passwordHash, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: { user: userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

export const approvePhysicianController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const physicianId = req.user.id;
    const { approved } = req.body;

    if (!physicianId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid physician ID',
      });
    }

    if (typeof approved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Approval status must be a boolean',
      });
    }

    if (req.user?.role !== Role.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can approve physicians',
      });
    }

    await authService.approvePhysician(physicianId, approved);

    return res.status(200).json({
      success: true,
      message: `Physician ${approved ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const softDeleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { deletionReason, password } = SoftDeleteUserSchema.parse(req.body);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account',
      });
    }

    if (userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Cannot delete this account',
      });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true, email: true, username: true },
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordValid = await comparePassword(
      password,
      currentUser.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid password. Please enter your current password to confirm account deletion.',
      });
    }

    const user = await authService.softDeleteUser(
      userId,
      deletionReason ?? 'USER_REQUESTED',
    );

    return res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error in softDeleteUserController:', error);
    next(error);
  }
};

export const restoreUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Cannot restore this account',
      });
    }

    const user = await authService.restoreUser(Number(userId));

    return res.status(200).json({
      success: true,
      message: 'User restored successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error in restoreUserController:', error);
    next(error);
  }
};
