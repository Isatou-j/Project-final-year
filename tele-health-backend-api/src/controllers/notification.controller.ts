import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getNotificationsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const isRead = req.query.isRead
      ? req.query.isRead === 'true'
      : undefined;

    const result = await notificationService.getNotifications(userId, {
      limit,
      offset,
      isRead,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsReadController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notificationId = parseInt(req.params.id);
    if (isNaN(notificationId)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    const notification =
      await notificationService.markNotificationAsRead(
        notificationId,
        userId,
      );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsReadController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await notificationService.markAllNotificationsAsRead(userId);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotificationController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notificationId = parseInt(req.params.id);
    if (isNaN(notificationId)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    await notificationService.deleteNotification(notificationId, userId);

    res.status(200).json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    next(error);
  }
};


