import { Request, Response, NextFunction } from 'express';
import * as physicianService from '../services/physician.service';
import { requireAdmin } from '../middleware/auth.middleware';

export const getPhysicianProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const physician = await physicianService.getPhysicianProfile(userId);
    return res.json(physician);
  } catch (error) {
    next(error);
  }
};

export const updatePhysicianProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const updated = await physicianService.updatePhysicianProfile(
      userId,
      req.body,
    );
    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const approvePhysicianController = [
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const physicianId = parseInt(req.params.id);
      const physician = await physicianService.approvePhysician(physicianId);
      return res.json({
        message: 'Physician approved successfully',
        data: physician,
      });
    } catch (error) {
      next(error);
    }
  },
];

export const rejectPhysicianController = [
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const physicianId = parseInt(req.params.id);
      const physician = await physicianService.rejectPhysician(physicianId);
      return res.json({
        message: 'Physician rejected',
        data: physician,
      });
    } catch (error) {
      next(error);
    }
  },
];

export const getAllPhysiciansController = [
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const page = req.query.page
        ? parseInt(req.query.page as string)
        : undefined;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const specialty = req.query.specialty as string | undefined;
      const status = req.query.status as string | undefined;

      const result = await physicianService.getAllPhysicians(
        page,
        limit,
        specialty,
        status,
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },
];

export const getPublicPhysiciansController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const page = req.query.page
      ? parseInt(req.query.page as string)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const specialty = req.query.specialty as string | undefined;

    const result = await physicianService.getPublicPhysicians(
      page,
      limit,
      specialty,
    );
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getTopRatedPhysicianController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const physician = await physicianService.getTopRatedPhysician();
    return res.json(physician);
  } catch (error) {
    next(error);
  }
};

export const getStatisticsController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const statistics = await physicianService.getStatistics();
    return res.json(statistics);
  } catch (error) {
    next(error);
  }
};
