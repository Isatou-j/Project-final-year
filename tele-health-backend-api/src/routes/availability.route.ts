import { Router } from 'express';
import {
  getPhysicianAvailabilityController,
  updatePhysicianAvailabilityController,
  setPhysicianAvailabilityStatusController,
} from '../controllers/availability.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/physician', getPhysicianAvailabilityController);
router.put('/physician', updatePhysicianAvailabilityController);
router.patch('/physician/status', setPhysicianAvailabilityStatusController);

export default router;

