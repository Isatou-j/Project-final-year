import { Request, Response, NextFunction } from 'express';
import * as appointmentService from '../services/appointment.service';
import { requireStaffOrAdmin, requireAdmin } from '../middleware/auth.middleware';

export const bookAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const data = { ...req.body, patientId: userId };
    const appointment = await appointmentService.bookAppointment(data);
    return res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const getPatientAppointmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const appointments =
      await appointmentService.getPatientAppointments(userId);
    return res.json(appointments);
  } catch (error) {
    next(error);
  }
};

export const getPhysicianAppointmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const appointments =
      await appointmentService.getPhysicianAppointments(userId);
    return res.json(appointments);
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatusController = [
  requireStaffOrAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const appointmentId = parseInt(req.params.id);
      const { status } = req.body;
      const appointment = await appointmentService.updateAppointmentStatus(
        appointmentId,
        status,
      );
      return res.json(appointment);
    } catch (error) {
      next(error);
    }
  },
];

export const cancelAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const appointmentId = parseInt(req.params.id);
    const userRole = req.user?.role;

    // Determine who cancelled based on role
    let cancelledBy: 'patient' | 'physician' | 'admin' = 'patient';
    if (userRole === 'ADMIN') {
      cancelledBy = 'admin';
    } else if (userRole === 'PHYSICIAN') {
      cancelledBy = 'physician';
    }

    const appointment = await appointmentService.cancelAppointment(
      appointmentId,
      cancelledBy,
    );
    return res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const getAllAppointmentsController = [
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const page = req.query.page
        ? parseInt(req.query.page as string)
        : undefined;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await appointmentService.getAllAppointments(
        page,
        limit,
        status,
        search,
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },
];
