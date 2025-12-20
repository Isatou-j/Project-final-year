import prisma from '../lib/prisma';

export interface AvailabilityInput {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
}

export const getPhysicianAvailability = async (physicianId: number) => {
  return prisma.availability.findMany({
    where: { physicianId },
    orderBy: { dayOfWeek: 'asc' },
  });
};

export const updatePhysicianAvailability = async (
  physicianId: number,
  availabilities: AvailabilityInput[],
) => {
  // Delete existing availabilities
  await prisma.availability.deleteMany({
    where: { physicianId },
  });

  // Create new availabilities
  const created = await prisma.availability.createMany({
    data: availabilities.map(avail => ({
      physicianId,
      dayOfWeek: avail.dayOfWeek,
      startTime: avail.startTime,
      endTime: avail.endTime,
      isAvailable: avail.isAvailable,
    })),
  });

  return prisma.availability.findMany({
    where: { physicianId },
    orderBy: { dayOfWeek: 'asc' },
  });
};

export const setPhysicianAvailabilityStatus = async (
  physicianId: number,
  isAvailable: boolean,
) => {
  // Update physician's isAvailable status
  return prisma.physician.update({
    where: { id: physicianId },
    data: { isAvailable },
  });
};

