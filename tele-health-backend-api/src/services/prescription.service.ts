/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../lib/prisma';

export const createPrescription = async (data: {
  appointmentId: number;
  diagnosis: string;
  medications: string;
  instructions?: string;
  followUpDate?: Date;
}) => {
  return prisma.prescription.create({
    data,
    include: {
      appointment: {
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          physician: {
            include: {
              user: true,
            },
          },
          service: true,
        },
      },
    },
  });
};

export const getAllPrescriptions = async (options?: {
  page?: number;
  limit?: number;
  patientId?: number;
  physicianId?: number;
  search?: string;
}) => {
  const {
    page = 1,
    limit = 10,
    patientId,
    physicianId,
    search,
  } = options ?? {};

  const skip = (page - 1) * limit;
  const where: any = {};

  if (patientId) {
    where.appointment = { patientId };
  }

  if (physicianId) {
    where.appointment = { ...where.appointment, physicianId };
  }

  if (search) {
    where.OR = [
      { diagnosis: { contains: search, mode: 'insensitive' } },
      { medications: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [prescriptions, total] = await Promise.all([
    prisma.prescription.findMany({
      where,
      skip,
      take: limit,
      include: {
        appointment: {
          include: {
            patient: {
              include: {
                user: true,
              },
            },
            physician: {
              include: {
                user: true,
              },
            },
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.prescription.count({ where }),
  ]);

  return {
    prescriptions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getPrescriptionById = async (id: number) => {
  return prisma.prescription.findUnique({
    where: { id },
    include: {
      appointment: {
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          physician: {
            include: {
              user: true,
            },
          },
          service: true,
        },
      },
    },
  });
};

export const getPrescriptionByAppointmentId = async (appointmentId: number) => {
  return prisma.prescription.findUnique({
    where: { appointmentId },
    include: {
      appointment: {
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          physician: {
            include: {
              user: true,
            },
          },
          service: true,
        },
      },
    },
  });
};

export const getPatientPrescriptions = async (patientId: number) => {
  return prisma.prescription.findMany({
    where: {
      appointment: {
        patientId,
      },
    },
    include: {
      appointment: {
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          physician: {
            include: {
              user: true,
            },
          },
          service: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPhysicianPrescriptions = async (physicianId: number) => {
  return prisma.prescription.findMany({
    where: {
      appointment: {
        physicianId,
      },
    },
    include: {
      appointment: {
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          physician: {
            include: {
              user: true,
            },
          },
          service: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updatePrescription = async (
  id: number,
  data: {
    diagnosis?: string;
    medications?: string;
    instructions?: string;
    followUpDate?: Date;
  },
) => {
  return prisma.prescription.update({
    where: { id },
    data,
    include: {
      appointment: {
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          physician: {
            include: {
              user: true,
            },
          },
          service: true,
        },
      },
    },
  });
};

export const deletePrescription = async (id: number) => {
  return prisma.prescription.delete({ where: { id } });
};

export const getPrescriptionStats = async (filters?: {
  patientId?: number;
  physicianId?: number;
}) => {
  const where: any = {};

  if (filters?.patientId) {
    where.appointment = { patientId: filters.patientId };
  }

  if (filters?.physicianId) {
    where.appointment = {
      ...where.appointment,
      physicianId: filters.physicianId,
    };
  }

  const [totalPrescriptions, upcomingFollowUps, recentPrescriptions] =
    await Promise.all([
      prisma.prescription.count({ where }),
      prisma.prescription.count({
        where: {
          ...where,
          followUpDate: {
            gte: new Date(),
          },
        },
      }),
      prisma.prescription.findMany({
        where,
        take: 5,
        include: {
          appointment: {
            include: {
              patient: {
                include: {
                  user: true,
                },
              },
              physician: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

  return {
    totalPrescriptions,
    upcomingFollowUps,
    recentPrescriptions,
  };
};
