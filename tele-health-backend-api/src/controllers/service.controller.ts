import { Request, Response, NextFunction } from 'express';
import * as serviceService from '../services/service.service';
import { requireAdmin } from '../middleware/auth.middleware';

export const getPublicServicesController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const services = await serviceService.getPublicServices();
    return res.json(services);
  } catch (error) {
    next(error);
  }
};

export const getAllServicesController = [
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const page = req.query.page
        ? parseInt(req.query.page as string)
        : undefined;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const search = req.query.search as string | undefined;
      const isActive =
        req.query.isActive !== undefined
          ? req.query.isActive === 'true'
          : undefined;

      const result = await serviceService.getAllServices(
        page,
        limit,
        search,
        isActive,
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },
];

export const createServiceController = [
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { name, description, icon, isActive } = req.body;

      if (!name || !description) {
        return res.status(400).json({
          message: 'Name and description are required',
        });
      }

      const service = await serviceService.createService({
        name,
        description,
        icon,
        isActive,
      });

      return res.status(201).json({
        message: 'Service created successfully',
        data: service,
      });
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  },
];

export const updateServiceController = [
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const serviceId = parseInt(req.params.id);
      const { name, description, icon, isActive } = req.body;

      if (isNaN(serviceId)) {
        return res.status(400).json({ message: 'Invalid service ID' });
      }

      const service = await serviceService.updateService(serviceId, {
        name,
        description,
        icon,
        isActive,
      });

      return res.json({
        message: 'Service updated successfully',
        data: service,
      });
    } catch (error: any) {
      if (error.message === 'Service not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('already exists')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  },
];

export const deleteServiceController = [
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const serviceId = parseInt(req.params.id);

      if (isNaN(serviceId)) {
        return res.status(400).json({ message: 'Invalid service ID' });
      }

      await serviceService.deleteService(serviceId);

      return res.json({
        message: 'Service deleted successfully',
      });
    } catch (error: any) {
      if (error.message === 'Service not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('Cannot delete')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  },
];
