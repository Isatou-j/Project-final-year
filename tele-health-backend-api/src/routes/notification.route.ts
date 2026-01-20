import { Router } from 'express';
import {
  getNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
} from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

router.get('/', getNotificationsController);
router.patch('/:id/read', markNotificationAsReadController);
router.patch('/read-all', markAllNotificationsAsReadController);
router.delete('/:id', deleteNotificationController);

export default router;


