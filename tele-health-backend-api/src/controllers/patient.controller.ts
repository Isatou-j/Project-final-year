import { Request, Response, NextFunction } from 'express';
import * as patientService from '../services/patient.service';
import { requireAdmin } from '../middleware/auth.middleware';

export const getPatientProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const patient = await patientService.getPatientProfile(userId);
    return res.json(patient);
  } catch (error) {
    next(error);
  }
};

export const updatePatientProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const updated = await patientService.updatePatientProfile(userId, req.body);
    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const getPatientMedicalRecordsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const records = await patientService.getPatientMedicalRecords(userId);
    return res.json(records);
  } catch (error) {
    next(error);
  }
};

export const getAllPatientsController = [
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const page = req.query.page
        ? parseInt(req.query.page as string)
        : undefined;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const search = req.query.search as string | undefined;

      const result = await patientService.getAllPatients(page, limit, search);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },
];
