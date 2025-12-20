import { Router } from 'express';

import {
  registerPatientController,
  registerPhysicianController,
  refreshTokenController,
  verifyEmailController,
  changePasswordController,
  requestVerificationCodeController,
  validateResetTokenController,
  requestPasswordResetController,
  passwordResetController,
  logoutController,
  softDeleteUserController,
  registerAdminController,
  restoreUserController,
  loginController,
} from '../controllers/auth.controller';
import { authMiddleware, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', loginController);
router.post('/patient/register', registerPatientController);
router.post('/physician/register', registerPhysicianController);
router.post('/refresh-token', refreshTokenController);
router.post('/verify-email', verifyEmailController);
router.post('/change-password', authMiddleware, changePasswordController);
router.post('/request-verification-code', requestVerificationCodeController);
router.post('/validate-reset-token', validateResetTokenController);
router.post('/request-password-reset', requestPasswordResetController);
router.post('/reset-password', passwordResetController);
router.post('/logout', authMiddleware, logoutController);
router.delete('/:id', authMiddleware, softDeleteUserController);

router.post('/admin/register', registerAdminController);
router.patch(
  '/admin/:id/restore',
  authMiddleware,
  requireAdmin,
  restoreUserController,
);

export default router;
