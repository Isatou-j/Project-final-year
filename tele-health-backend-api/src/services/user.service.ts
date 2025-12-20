/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../lib/prisma';
import { Role } from '../prisma/generated/prisma';

export const getAllUsersService = async (options?: {
  page?: number;
  limit?: number;
  role?: Role;
  search?: string;
  includeDeleted?: boolean;
}) => {
  const {
    page = 1,
    limit = 10,
    role,
    search,
    includeDeleted = false,
  } = options ?? {};

  const skip = (page - 1) * limit;

  const where: any = {};

  if (!includeDeleted) {
    where.deletedAt = null;
  }

  if (role) {
    where.role = role;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        profileUrl: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        deletedAt: true,
        deletionReason: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

export const updateUserRoleService = async (userId: number, newRole: Role) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, username: true },
  });

  if (!existingUser) {
    throw new Error('User not found');
  }

  if (existingUser.role === newRole) {
    throw new Error(`User already has the role: ${newRole}`);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      role: newRole,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const getUserStatsService = async () => {
  const [totalUsers, totalAdmins, verifiedUsers, deletedUsers, recentUsers] =
    await Promise.all([
      prisma.user.count({ where: { role: Role.PATIENT, deletedAt: null } }),
      prisma.user.count({ where: { role: Role.PHYSICIAN, deletedAt: null } }),
      prisma.user.count({ where: { role: Role.ADMIN, deletedAt: null } }),
      prisma.user.count({ where: { isVerified: true, deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: { not: null } } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          deletedAt: null,
        },
      }),
    ]);

  return {
    totalUsers,
    totalAdmins,
    verifiedUsers,
    deletedUsers,
    recentUsers,
    unverifiedUsers: totalUsers + totalAdmins - verifiedUsers,
  };
};

export const getCurrentUserService = async (userId: number): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      profileUrl: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const updateProfileDetailsService = async (
  userId: number,
  data: { name?: string; email?: string },
): Promise<any> => {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const updateProfilePictureService = async (
  userId: number,
  profileUrl: string,
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { profileUrl },
  });
};
