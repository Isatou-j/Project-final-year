/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import * as prescriptionService from '../services/prescription.service';

export const createPrescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const {
      appointmentId,
      diagnosis,
      medications,
      instructions,
      followUpDate,
    } = req.body;

    if (!appointmentId || !diagnosis || !medications) {
      return res.status(400).json({
        message:
          'Missing required fields: appointmentId, diagnosis, medications',
      });
    }

    const prescription = await prescriptionService.createPrescription({
      appointmentId: Number(appointmentId),
      diagnosis,
      medications,
      instructions,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
    });

    res.status(201).json({
      data: prescription,
      message: 'Prescription created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPrescriptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const patientId = req.query.patientId
      ? Number(req.query.patientId)
      : undefined;
    const physicianId = req.query.physicianId
      ? Number(req.query.physicianId)
      : undefined;
    const search = req.query.search as string | undefined;

    const result = await prescriptionService.getAllPrescriptions({
      page,
      limit,
      patientId,
      physicianId,
      search,
    });

    res.status(200).json({
      message: 'Prescriptions retrieved successfully',
      data: result.prescriptions,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const prescription = await prescriptionService.getPrescriptionById(id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json({
      data: prescription,
      message: 'Prescription retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionByAppointmentIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const appointmentId = Number(req.params.appointmentId);
    const prescription =
      await prescriptionService.getPrescriptionByAppointmentId(appointmentId);

    if (!prescription) {
      return res
        .status(404)
        .json({ message: 'Prescription not found for this appointment' });
    }

    res.status(200).json({
      data: prescription,
      message: 'Prescription retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientPrescriptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const patientId = Number(req.params.patientId);
    const prescriptions =
      await prescriptionService.getPatientPrescriptions(patientId);

    res.status(200).json({
      data: prescriptions,
      message: 'Patient prescriptions retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getPhysicianPrescriptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const physicianId = Number(req.params.physicianId);
    const prescriptions =
      await prescriptionService.getPhysicianPrescriptions(physicianId);

    res.status(200).json({
      data: prescriptions,
      message: 'Physician prescriptions retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updatePrescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const { diagnosis, medications, instructions, followUpDate } = req.body;

    const updated = await prescriptionService.updatePrescription(id, {
      diagnosis,
      medications,
      instructions,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
    });

    res.status(200).json({
      data: updated,
      message: 'Prescription updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const deletePrescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = Number(req.params.id);
    await prescriptionService.deletePrescription(id);

    res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const patientId = req.query.patientId
      ? Number(req.query.patientId)
      : undefined;
    const physicianId = req.query.physicianId
      ? Number(req.query.physicianId)
      : undefined;

    const stats = await prescriptionService.getPrescriptionStats({
      patientId,
      physicianId,
    });

    res.status(200).json({
      message: 'Prescription statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
