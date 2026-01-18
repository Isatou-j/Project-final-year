import prisma from '../lib/prisma';
import { AppointmentStatus, PhysicianStatus } from '../prisma/generated/prisma';
import { sendPhysicianApprovalEmail } from './email.service';

export interface PhysicianCreateInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  qualification: string;
  consultationFee?: number;
}

export const getPhysicianProfile = async (userId: number) => {
  const physician = await prisma.physician.findUnique({
    where: { userId },
    include: { user: true },
  });

  if (!physician) {
    throw new Error('Physician not found');
  }

  return physician;
};

export const updatePhysicianProfile = async (
  userId: number,
  data: Partial<PhysicianCreateInput>,
) => {
  const physician = await prisma.physician.findUnique({ where: { userId } });
  if (!physician) {
    throw new Error('Physician not found');
  }

  const updatedPhysician = await prisma.physician.update({
    where: { userId },
    data,
  });

  return updatedPhysician;
};

export const approvePhysician = async (physicianId: number) => {
  const physician = await prisma.physician.update({
    where: { id: physicianId },
    data: { status: PhysicianStatus.APPROVED, isAvailable: true },
    include: { user: true },
  });

  // Send approval email
  try {
    const physicianName = `${physician.firstName} ${physician.lastName}`;
    await sendPhysicianApprovalEmail(physician.user.email, physicianName, true);
  } catch (emailError) {
    console.error('Failed to send physician approval email:', emailError);
    // Don't throw - approval was successful even if email failed
  }

  // Send notification
  try {
    await notificationService.createNotification({
      userId: physician.userId,
      type: 'SYSTEM',
      title: 'Account Approved',
      message: 'Your physician account has been approved! You can now start accepting appointments.',
      link: '/physician/dashboard',
      metadata: {
        physicianId: physician.id,
        status: 'APPROVED',
      },
    });
  } catch (notificationError) {
    console.error('Failed to send approval notification:', notificationError);
  }

  return physician;
};

export const rejectPhysician = async (physicianId: number) => {
  const physician = await prisma.physician.update({
    where: { id: physicianId },
    data: { status: PhysicianStatus.REJECTED },
    include: { user: true },
  });

  // Send rejection email
  try {
    const physicianName = `${physician.firstName} ${physician.lastName}`;
    await sendPhysicianApprovalEmail(
      physician.user.email,
      physicianName,
      false,
    );
  } catch (emailError) {
    console.error('Failed to send physician rejection email:', emailError);
  }

  return physician;
};

export const getAllPhysicians = async (
  page?: number,
  limit?: number,
  specialty?: string,
  status?: string,
) => {
  const whereClause: any = {};
  if (specialty) {
    whereClause.specialization = specialty;
  }
  if (status) {
    whereClause.status = status;
  }

  const physicians = await prisma.physician.findMany({
    where: whereClause,
    include: { user: { select: { email: true, username: true } } },
  });

  // Apply pagination
  const pageNumber = page || 1;
  const limitNumber = limit || 10;
  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;
  const paginatedPhysicians = physicians.slice(startIndex, endIndex);

  return {
    physicians: paginatedPhysicians,
    total: physicians.length,
    page: pageNumber,
    limit: limitNumber,
  };
};

export const getPublicPhysicians = async (
  page?: number,
  limit?: number,
  specialty?: string,
) => {
  const physicians = await prisma.physician.findMany({
    where: {
      status: PhysicianStatus.APPROVED,
      ...(specialty && { specialization: specialty }),
    },
    include: {
      user: { select: { profileUrl: true } },
      reviews: true,
      appointments: { where: { status: AppointmentStatus.COMPLETED } },
    },
  });

  // Calculate ratings for each physician
  const physiciansWithRatings = physicians.map(physician => {
    const totalRating = physician.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const averageRating =
      physician.reviews.length > 0 ? totalRating / physician.reviews.length : 0;
    const reviewCount = physician.reviews.length;
    const patientCount = physician.appointments.length;

    return {
      id: physician.id,
      name: `Dr. ${physician.firstName} ${physician.lastName}`,
      specialty: physician.specialization,
      experience: `${physician.yearsOfExperience} Years`,
      patients: patientCount > 0 ? `${patientCount}+` : '0+',
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviews: reviewCount,
      fee: `${physician.consultationFee}`,
      available: physician.isAvailable,
      image: physician.profileImage || physician.user.profileUrl,
      about: physician.bio,
    };
  });

  // Apply pagination
  const pageNumber = page || 1;
  const limitNumber = limit || 10;
  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;
  const paginatedPhysicians = physiciansWithRatings.slice(startIndex, endIndex);

  return {
    physicians: paginatedPhysicians,
    total: physiciansWithRatings.length,
    page: pageNumber,
    limit: limitNumber,
  };
};

export const getTopRatedPhysician = async () => {
  const physicians = await prisma.physician.findMany({
    where: {
      status: PhysicianStatus.APPROVED,
    },
    include: {
      user: { select: { profileUrl: true } },
      reviews: true,
      appointments: { where: { status: AppointmentStatus.COMPLETED } },
    },
  });

  if (physicians.length === 0) {
    return null;
  }

  // Calculate ratings for each physician
  const physiciansWithRatings = physicians.map(physician => {
    const totalRating = physician.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const averageRating =
      physician.reviews.length > 0 ? totalRating / physician.reviews.length : 0;
    const reviewCount = physician.reviews.length;
    const patientCount = physician.appointments.length;

    return {
      ...physician,
      averageRating,
      reviewCount,
      patientCount,
    };
  });

  // Sort physicians by rating (highest first), then by review count
  const sortedPhysicians = physiciansWithRatings.sort((a, b) => {
    if (b.averageRating !== a.averageRating) {
      return b.averageRating - a.averageRating;
    }
    return b.reviewCount - a.reviewCount;
  });

  // Return the top-rated physician
  const topPhysician = sortedPhysicians[0];

  return {
    id: topPhysician.id,
    name: `Dr. ${topPhysician.firstName} ${topPhysician.lastName}`,
    specialty: topPhysician.specialization,
    experience: `${topPhysician.yearsOfExperience} Years`,
    patients:
      topPhysician.patientCount > 0 ? `${topPhysician.patientCount}+` : '0+',
    rating: Math.round(topPhysician.averageRating * 10) / 10,
    reviews: topPhysician.reviewCount,
    fee: `${topPhysician.consultationFee}`,
    available: topPhysician.isAvailable,
    image: topPhysician.profileImage || topPhysician.user.profileUrl,
    about: topPhysician.bio,
  };
};

export const getStatistics = async () => {
  // Get active patients (patients who have had completed appointments)
  const activePatientsCount = await prisma.patient.count({
    where: {
      appointments: {
        some: {
          status: AppointmentStatus.COMPLETED,
        },
      },
    },
  });

  // Get expert doctors (approved physicians)
  const expertDoctorsCount = await prisma.physician.count({
    where: { status: PhysicianStatus.APPROVED },
  });

  // Get consultations (completed appointments)
  const consultationsCount = await prisma.appointment.count({
    where: { status: AppointmentStatus.COMPLETED },
  });

  // Get average rating across all physician reviews
  const reviews = await prisma.review.findMany({
    select: { rating: true },
  });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  return {
    activePatients: activePatientsCount,
    expertDoctors: expertDoctorsCount,
    consultations: consultationsCount,
    averageRating: Math.round(averageRating * 10) / 10,
  };
};
