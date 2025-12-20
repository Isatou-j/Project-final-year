import { Router } from 'express';
import {
  getPhysicianProfileController,
  updatePhysicianProfileController,
  approvePhysicianController,
  rejectPhysicianController,
  getAllPhysiciansController,
  getPublicPhysiciansController,
  getTopRatedPhysicianController,
  getStatisticsController,
} from '../controllers/physician.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', authMiddleware, getPhysicianProfileController);
router.put('/profile', authMiddleware, updatePhysicianProfileController);
router.patch('/:id/approve', authMiddleware, ...approvePhysicianController);
router.patch('/:id/reject', authMiddleware, ...rejectPhysicianController);
router.get('/getAll', authMiddleware, ...getAllPhysiciansController);
router.get('/public', getPublicPhysiciansController);
router.get('/top-rated', getTopRatedPhysicianController);
router.get('/statistics', getStatisticsController);

export default router;
