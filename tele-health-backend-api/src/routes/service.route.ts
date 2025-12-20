import { Router } from 'express';
import {
  getPublicServicesController,
  getAllServicesController,
  createServiceController,
  updateServiceController,
  deleteServiceController,
} from '../controllers/service.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/public', getPublicServicesController);

// Admin routes
router.get('/getAll', authMiddleware, ...getAllServicesController);
router.post('/create', authMiddleware, ...createServiceController);
router.put('/:id', authMiddleware, ...updateServiceController);
router.delete('/:id', authMiddleware, ...deleteServiceController);

export default router;
