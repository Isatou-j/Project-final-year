import prisma from '../lib/prisma';
import { emitNotification } from '../socket/socket';

export interface CreateNotificationData {
  userId: number;
  type: 'APPOINTMENT' | 'PRESCRIPTION' | 'PAYMENT' | 'MEDICAL_RECORD' | 'SYSTEM';
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}

export const createNotification = async (
  data: CreateNotificationData,
) => {
  const notification = await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
      metadata: data.metadata || {},
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  // Emit real-time notification via Socket.io
  emitNotification(data.userId, {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    link: notification.link || undefined,
    metadata: notification.metadata as any,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
  });

  return notification;
};

export const getNotifications = async (
  userId: number,
  options?: {
    limit?: number;
    offset?: number;
    isRead?: boolean;
  },
) => {
  const where: any = { userId };

  if (options?.isRead !== undefined) {
    where.isRead = options.isRead;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    }),
    prisma.notification.count({ where }),
  ]);

  const unreadCount = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  return {
    notifications,
    total,
    unreadCount,
  };
};

export const markNotificationAsRead = async (
  notificationId: number,
  userId: number,
) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

export const markAllNotificationsAsRead = async (userId: number) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

export const deleteNotification = async (
  notificationId: number,
  userId: number,
) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  return prisma.notification.delete({
    where: { id: notificationId },
  });
};


