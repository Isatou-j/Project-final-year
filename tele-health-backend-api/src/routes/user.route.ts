import express from 'express';

import { softDeleteUserController } from '../controllers/auth.controller';

import {
  getAllUsersController,
  updateUserRoleController,
  getCurrentUserController,
  updateProfileDetailsController,
  updateProfilePictureController,
} from '../controllers/user.controller';
import { authMiddleware, requireAdmin } from '../middleware/auth.middleware';
import { upload } from '../middleware/multer.middleware';
import { handleUploadError } from '../middleware/upload-error.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/me', getCurrentUserController);
router.put('/profile-details', updateProfileDetailsController);
router.put(
  '/profile-picture',
  upload.single('image'),
  handleUploadError,
  updateProfilePictureController,
);

router.use(requireAdmin);

router.get('/admin/users', getAllUsersController);
router.delete(
  '/admin/delete/user/:id',

  softDeleteUserController,
);
router.patch(
  '/admin/user/:id/role',

  updateUserRoleController,
);

export default router;
