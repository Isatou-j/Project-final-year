import prisma from '../lib/prisma';

export interface ServiceCreateInput {
  name: string;
  description: string;
  icon?: string;
  isActive?: boolean;
}

export interface ServiceUpdateInput {
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export const getPublicServices = async () => {
  return prisma.service.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      description: true,
      icon: true,
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const getAllServices = async (
  page?: number,
  limit?: number,
  search?: string,
  isActive?: boolean,
) => {
  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (isActive !== undefined) {
    whereClause.isActive = isActive;
  }

  const services = await prisma.service.findMany({
    where: whereClause,
    include: {
      _count: {
        select: {
          appointments: true,
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
  const paginatedServices = services.slice(startIndex, endIndex);

  return {
    services: paginatedServices,
    total: services.length,
    page: pageNumber,
    limit: limitNumber,
  };
};

export const createService = async (data: ServiceCreateInput) => {
  // Check if service with same name already exists
  const existingService = await prisma.service.findUnique({
    where: { name: data.name },
  });

  if (existingService) {
    throw new Error('Service with this name already exists');
  }

  return prisma.service.create({
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

export const updateService = async (
  serviceId: number,
  data: ServiceUpdateInput,
) => {
  const existingService = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!existingService) {
    throw new Error('Service not found');
  }

  // If name is being updated, check if new name already exists
  if (data.name && data.name !== existingService.name) {
    const nameExists = await prisma.service.findUnique({
      where: { name: data.name },
    });

    if (nameExists) {
      throw new Error('Service with this name already exists');
    }
  }

  return prisma.service.update({
    where: { id: serviceId },
    data,
  });
};

export const deleteService = async (serviceId: number) => {
  const existingService = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      _count: {
        select: {
          appointments: true,
        },
      },
    },
  });

  if (!existingService) {
    throw new Error('Service not found');
  }

  // Check if service has appointments
  if (existingService._count.appointments > 0) {
    throw new Error(
      'Cannot delete service that has appointments. Deactivate it instead.',
    );
  }

  return prisma.service.delete({
    where: { id: serviceId },
  });
};
