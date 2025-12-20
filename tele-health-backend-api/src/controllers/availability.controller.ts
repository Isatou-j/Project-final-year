import { Request, Response, NextFunction } from 'express';
import * as availabilityService from '../services/availability.service';
import * as physicianService from '../services/physician.service';

export const getPhysicianAvailabilityController = async (
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
    const availabilities = await availabilityService.getPhysicianAvailability(
      physician.id,
    );

    return res.json(availabilities);
  } catch (error) {
    next(error);
  }
};

export const updatePhysicianAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { availabilities } = req.body;

    if (!Array.isArray(availabilities)) {
      return res.status(400).json({
        message: 'Availabilities must be an array',
      });
    }

    const physician = await physicianService.getPhysicianProfile(userId);
    const updated = await availabilityService.updatePhysicianAvailability(
      physician.id,
      availabilities,
    );

    return res.json({
      message: 'Availability updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const setPhysicianAvailabilityStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        message: 'isAvailable must be a boolean',
      });
    }

    const physician = await physicianService.getPhysicianProfile(userId);
    const updated = await availabilityService.setPhysicianAvailabilityStatus(
      physician.id,
      isAvailable,
    );

    return res.json({
      message: 'Availability status updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

