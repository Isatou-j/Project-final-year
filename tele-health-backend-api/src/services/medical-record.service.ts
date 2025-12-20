/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../lib/prisma';

export const createMedicalRecord = async (data: {
  patientId: number;
  documentName: string;
  documentType: string;
  fileUrl: string;
  uploadedBy: string;
}) => {
  return prisma.medicalRecord.create({
    data,
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const getAllMedicalRecords = async (options?: {
  page?: number;
  limit?: number;
  patientId?: number;
  documentType?: string;
  search?: string;
}) => {
  const {
    page = 1,
    limit = 10,
    patientId,
    documentType,
    search,
  } = options ?? {};

  const skip = (page - 1) * limit;
  const where: any = {};

  if (patientId) {
    where.patientId = patientId;
  }

  if (documentType) {
    where.documentType = documentType;
  }

  if (search) {
    where.OR = [
      { documentName: { contains: search, mode: 'insensitive' } },
      { documentType: { contains: search, mode: 'insensitive' } },
      { uploadedBy: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [records, total] = await Promise.all([
    prisma.medicalRecord.findMany({
      where,
      skip,
      take: limit,
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.medicalRecord.count({ where }),
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getMedicalRecordById = async (id: number) => {
  return prisma.medicalRecord.findUnique({
    where: { id },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const getPatientMedicalRecords = async (patientId: number) => {
  return prisma.medicalRecord.findMany({
    where: { patientId },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateMedicalRecord = async (
  id: number,
  data: {
    documentName?: string;
    documentType?: string;
    fileUrl?: string;
  },
) => {
  return prisma.medicalRecord.update({
    where: { id },
    data,
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const deleteMedicalRecord = async (id: number) => {
  return prisma.medicalRecord.delete({ where: { id } });
};

export const getMedicalRecordStats = async (patientId?: number) => {
  const where: any = {};
  if (patientId) {
    where.patientId = patientId;
  }

  const [totalRecords, recordsByType, recentRecords] = await Promise.all([
    prisma.medicalRecord.count({ where }),
    prisma.medicalRecord.groupBy({
      by: ['documentType'],
      _count: { id: true },
      where,
      orderBy: { _count: { id: 'desc' } },
    }),
    prisma.medicalRecord.findMany({
      where,
      take: 5,
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    totalRecords,
    recordsByType: recordsByType.map(item => ({
      type: item.documentType,
      count: item._count.id,
    })),
    recentRecords,
  };
};
