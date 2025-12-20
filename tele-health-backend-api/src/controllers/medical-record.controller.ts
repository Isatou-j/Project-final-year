/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import * as medicalRecordService from '../services/medical-record.service';

export const createMedicalRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { patientId, documentName, documentType, fileUrl, uploadedBy } =
      req.body;

    if (
      !patientId ||
      !documentName ||
      !documentType ||
      !fileUrl ||
      !uploadedBy
    ) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    const record = await medicalRecordService.createMedicalRecord({
      patientId: Number(patientId),
      documentName,
      documentType,
      fileUrl,
      uploadedBy,
    });

    res.status(201).json({
      data: record,
      message: 'Medical record created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMedicalRecordsController = async (
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
    const documentType = req.query.documentType as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await medicalRecordService.getAllMedicalRecords({
      page,
      limit,
      patientId,
      documentType,
      search,
    });

    res.status(200).json({
      message: 'Medical records retrieved successfully',
      data: result.records,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getMedicalRecordByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const record = await medicalRecordService.getMedicalRecordById(id);

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.status(200).json({
      data: record,
      message: 'Medical record retrieved successfully',
    });
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
    const patientId = Number(req.params.patientId);
    const records =
      await medicalRecordService.getPatientMedicalRecords(patientId);

    res.status(200).json({
      data: records,
      message: 'Patient medical records retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedicalRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const { documentName, documentType, fileUrl } = req.body;

    const updated = await medicalRecordService.updateMedicalRecord(id, {
      documentName,
      documentType,
      fileUrl,
    });

    res.status(200).json({
      data: updated,
      message: 'Medical record updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMedicalRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = Number(req.params.id);
    await medicalRecordService.deleteMedicalRecord(id);

    res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMedicalRecordStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const patientId = req.query.patientId
      ? Number(req.query.patientId)
      : undefined;
    const stats = await medicalRecordService.getMedicalRecordStats(patientId);

    res.status(200).json({
      message: 'Medical record statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
