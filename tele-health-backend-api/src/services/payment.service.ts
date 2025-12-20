import prisma from '../lib/prisma';
import { PaymentRequest } from '../types';

export const createPayment = async (data: PaymentRequest) => {
  return prisma.payment.create({ data });
};

export const getAllPayments = async () => {
  return prisma.payment.findMany({
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
      invoice: true,
    },
  });
};

export const getPaymentById = async (id: number) => {
  return prisma.payment.findUnique({
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
      invoice: true,
    },
  });
};

export const updatePayment = async (id: number, data: any) => {
  return prisma.payment.update({ where: { id }, data });
};

export const deletePayment = async (id: number) => {
  return prisma.payment.delete({ where: { id } });
};

export const getPhysicianPayments = async (physicianId: number) => {
  return prisma.payment.findMany({
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
              user: {
                select: {
                  email: true,
                  username: true,
                },
              },
            },
          },
          service: true,
        },
      },
      invoice: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPhysicianEarnings = async (physicianId: number) => {
  const payments = await prisma.payment.findMany({
    where: {
      appointment: {
        physicianId,
      },
      status: 'PAID',
    },
    include: {
      appointment: {
        select: {
          appointmentDate: true,
          service: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const totalEarnings = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );

  // Calculate monthly earnings
  const monthlyEarnings = payments.reduce((acc, payment) => {
    const month = new Date(payment.appointment.appointmentDate).toLocaleString(
      'default',
      { month: 'long', year: 'numeric' },
    );
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += Number(payment.amount);
    return acc;
  }, {} as Record<string, number>);

  return {
    totalEarnings,
    totalTransactions: payments.length,
    monthlyEarnings,
    payments: payments.slice(0, 10), // Recent 10 payments
  };
};
