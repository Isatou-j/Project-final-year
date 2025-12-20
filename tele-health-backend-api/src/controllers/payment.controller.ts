import { Request, Response, NextFunction } from 'express';
import * as paymentService from '../services/payment.service';
import * as physicianService from '../services/physician.service';
import {
  createPaymentSchema,
  updatePaymentSchema,
} from '../validators/payment.schema';

export const createPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const parsedRequest = createPaymentSchema.safeParse(req.body);

    if (!parsedRequest.success) {
      return res.status(400).json({
        message: parsedRequest.error,
      });
    }
    const payment = await paymentService.createPayment(parsedRequest.data);
    res.status(201).json({
      data: payment,
      message: 'Payment created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPaymentsController = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

export const getPaymentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const payment = await paymentService.getPaymentById(id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

export const updatePaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const id = Number(req.params.id);

    const parsed = updatePaymentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error,
      });
    }
    const updated = await paymentService.updatePayment(id, parsed.data);
    res.json({ data: updated, message: 'Payment updated successfully.' });
  } catch (error) {
    next(error);
  }
};

export const deletePaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    await paymentService.deletePayment(id);
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getPhysicianPaymentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const physician = await physicianService.getPhysicianProfile(userId);
    const payments = await paymentService.getPhysicianPayments(physician.id);

    return res.json(payments);
  } catch (error) {
    next(error);
  }
};

export const getPhysicianEarningsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const physician = await physicianService.getPhysicianProfile(userId);
    const earnings = await paymentService.getPhysicianEarnings(physician.id);

    return res.json(earnings);
  } catch (error) {
    next(error);
  }
};
