/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';

import {
  getAllUsersService,
  getCurrentUserService,
  getUserStatsService,
  updateProfileDetailsService,
  updateProfilePictureService,
  updateUserRoleService,
} from '../services/user.service';
import { UpdateProfileDetailsSchema } from '../validators/user.schema';
import { Role } from '../prisma/generated/prisma';

export const getCurrentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await getCurrentUserService(userId);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfileDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const data = UpdateProfileDetailsSchema.parse(req.body);

    const updatedUser = await updateProfileDetailsService(userId, data);

    return res
      .status(200)
      .json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const updateProfilePictureController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const profileUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await updateProfilePictureService(userId, profileUrl);

    return res
      .status(200)
      .json({ message: 'Profile picture updated', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) ?? 1;
    const limit = parseInt(req.query.limit as string) ?? 10;
    const role = req.query.role as Role;
    const search = req.query.search as string;
    const includeDeleted = req.query.includeDeleted === 'true';

    if (limit > 100) {
      return res.status(400).json({
        message: 'Limit cannot exceed 100 users per page',
      });
    }

    if (role && !Object.values(Role).includes(role)) {
      return res.status(400).json({
        message: 'Invalid role specified',
      });
    }

    const result = await getAllUsersService({
      page,
      limit,
      role,
      search,
      includeDeleted,
    });

    return res.status(200).json({
      message: 'Users retrieved successfully',
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error('Error in getAllUsersController:', error);
    next(error);
  }
};

export const updateUserRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { role } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({
        message: 'Invalid role. Must be either USER or ADMIN',
      });
    }

    if (req.user?.id === userId) {
      return res.status(400).json({
        message: 'You cannot change your own role',
      });
    }

    const updatedUser = await updateUserRoleService(userId, role);

    return res.status(200).json({
      message: `User role updated to ${role} successfully`,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('Error in updateRoleController:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }

    if (error.message.includes('already has the role')) {
      return res.status(400).json({ message: error.message });
    }

    next(error);
  }
};

export const getUserStatsController = async (
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const stats = await getUserStatsService();

    return res.status(200).json({
      message: 'User statistics retrieved successfully',
      data: stats,
    });
  } catch (error: any) {
    console.error('Error in getUserStatsController:', error);
    next(error);
  }
};
