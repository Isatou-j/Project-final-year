import prisma from '../lib/prisma';
import { Gender } from '../prisma/generated/prisma';

export interface PatientCreateInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export const getPatientProfile = async (userId: number) => {
  const patient = await prisma.patient.findUnique({
    where: { userId },
    include: { user: true },
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  return patient;
};

export const updatePatientProfile = async (
  userId: number,
  data: Partial<PatientCreateInput>,
) => {
  const patient = await prisma.patient.findUnique({ where: { userId } });
  if (!patient) {
    throw new Error('Patient not found');
  }

  const updatedPatient = await prisma.patient.update({
    where: { userId },
    data,
  });

  return updatedPatient;
};

export const getPatientMedicalRecords = async (userId: number) => {
  const patient = await prisma.patient.findUnique({ where: { userId } });
  if (!patient) {
    throw new Error('Patient not found');
  }

  return prisma.medicalRecord.findMany({
    where: { patientId: patient.id },
  });
};

export const getAllPatients = async (
  page?: number,
  limit?: number,
  search?: string,
) => {
  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { phoneNumber: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { user: { username: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const patients = await prisma.patient.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          isVerified: true,
          isActive: true,
          profileUrl: true,
          createdAt: true,
          lastLogin: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Apply pagination
  const pageNumber = page || 1;
  const limitNumber = limit || 10;
  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;
  const paginatedPatients = patients.slice(startIndex, endIndex);

  return {
    patients: paginatedPatients,
    total: patients.length,
    page: pageNumber,
    limit: limitNumber,
  };
};
