import prisma from '../lib/prisma';
import {
  ConsultationType,
  AppointmentStatus,
} from '../prisma/generated/prisma';

import {
  sendAppointmentConfirmationEmail,
  sendAppointmentCancellationEmail,
} from './email.service';
import * as notificationService from './notification.service';

export interface AppointmentCreateInput {
  patientId: number;
  physicianId: number;
  serviceId: number;
  appointmentDate: Date;
  startTime: Date;
  endTime: Date;
  symptoms?: string;
  notes?: string;
  consultationType?: ConsultationType;
}

export const bookAppointment = async (data: AppointmentCreateInput) => {
  const {
    patientId,
    physicianId,
    serviceId,
    appointmentDate,
    startTime,
    endTime,
    symptoms,
    notes,
    consultationType,
  } = data;

  // Check if physician is available
  const physician = await prisma.physician.findUnique({
    where: { id: physicianId },
  });
  if (!physician || !physician.isAvailable) {
    throw new Error('Physician not available');
  }

  // Check for conflicting appointments
  const conflictingAppointment = await prisma.appointment.findFirst({
    where: {
      physicianId,
      appointmentDate,
      OR: [
        { startTime: { lt: endTime, gte: startTime } },
        { endTime: { gt: startTime, lte: endTime } },
      ],
    },
  });

  if (conflictingAppointment) {
    throw new Error('Appointment time conflicts with existing appointment');
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId,
      physicianId,
      serviceId,
      appointmentDate,
      startTime,
      endTime,
      symptoms,
      notes,
      consultationType,
    },
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
  });

  // Send confirmation email
  try {
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
    const physicianName = `${appointment.physician.firstName} ${appointment.physician.lastName}`;
    const appointmentTime = appointment.startTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    await sendAppointmentConfirmationEmail(
      appointment.patient.user.email,
      patientName,
      physicianName,
      appointment.appointmentDate,
      appointmentTime,
      appointment.consultationType || 'VIDEO',
      appointment.meetingLink || undefined,
    );
  } catch (emailError) {
    console.error('Failed to send appointment confirmation email:', emailError);
    // Don't throw - appointment was created successfully even if email failed
  }

  // Send real-time notification to patient
  try {
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
    const physicianName = `${appointment.physician.firstName} ${appointment.physician.lastName}`;
    
    await notificationService.createNotification({
      userId: appointment.patient.userId,
      type: 'APPOINTMENT',
      title: 'Appointment Confirmed',
      message: `Your appointment with Dr. ${physicianName} has been confirmed for ${appointment.appointmentDate.toLocaleDateString()}`,
      link: '/patient/appointments',
      metadata: {
        appointmentId: appointment.id,
        physicianId: appointment.physicianId,
        appointmentDate: appointment.appointmentDate.toISOString(),
      },
    });
  } catch (notificationError) {
    console.error('Failed to send notification:', notificationError);
  }

  // Send notification to physician
  try {
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
    
    await notificationService.createNotification({
      userId: appointment.physician.userId,
      type: 'APPOINTMENT',
      title: 'New Appointment',
      message: `New appointment with ${patientName} scheduled for ${appointment.appointmentDate.toLocaleDateString()}`,
      link: '/physician/appointments',
      metadata: {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        appointmentDate: appointment.appointmentDate.toISOString(),
      },
    });
  } catch (notificationError) {
    console.error('Failed to send physician notification:', notificationError);
  }

  return appointment;
};

export const getPatientAppointments = async (patientId: number) => {
  return prisma.appointment.findMany({
    where: { patientId },
    include: { physician: true, service: true },
  });
};

export const getPhysicianAppointments = async (physicianId: number) => {
  return prisma.appointment.findMany({
    where: { physicianId },
    include: { patient: true, service: true },
  });
};

export const updateAppointmentStatus = async (
  appointmentId: number,
  status: AppointmentStatus,
) => {
  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });
};

export const cancelAppointment = async (
  appointmentId: number,
  cancelledBy: 'patient' | 'physician' | 'admin' = 'patient',
) => {
  const appointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: AppointmentStatus.CANCELLED },
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
  });

  // Send cancellation email
  try {
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
    const physicianName = `${appointment.physician.firstName} ${appointment.physician.lastName}`;
    const appointmentTime = appointment.startTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    await sendAppointmentCancellationEmail(
      appointment.patient.user.email,
      patientName,
      physicianName,
      appointment.appointmentDate,
      appointmentTime,
      cancelledBy,
    );
  } catch (emailError) {
    console.error('Failed to send appointment cancellation email:', emailError);
  }

  return appointment;
};

export const getAllAppointments = async (
  page?: number,
  limit?: number,
  status?: string,
  search?: string,
) => {
  const whereClause: any = {};

  if (status) {
    whereClause.status = status;
  }

  if (search) {
    whereClause.OR = [
      {
        patient: {
          firstName: { contains: search, mode: 'insensitive' },
        },
      },
      {
        patient: {
          lastName: { contains: search, mode: 'insensitive' },
        },
      },
      {
        physician: {
          firstName: { contains: search, mode: 'insensitive' },
        },
      },
      {
        physician: {
          lastName: { contains: search, mode: 'insensitive' },
        },
      },
      {
        service: {
          name: { contains: search, mode: 'insensitive' },
        },
      },
    ];
  }

  const appointments = await prisma.appointment.findMany({
    where: whereClause,
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
      physician: {
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
      payment: {
        select: {
          id: true,
          amount: true,
          status: true,
          paymentMethod: true,
        },
      },
    },
    orderBy: { appointmentDate: 'desc' },
  });

  // Apply pagination
  const pageNumber = page || 1;
  const limitNumber = limit || 10;
  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;
  const paginatedAppointments = appointments.slice(startIndex, endIndex);

  return {
    appointments: paginatedAppointments,
    total: appointments.length,
    page: pageNumber,
    limit: limitNumber,
  };
};
