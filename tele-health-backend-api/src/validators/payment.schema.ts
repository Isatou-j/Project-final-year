import { z } from 'zod';

export const createPaymentSchema = z.object({
  appointmentId: z.number().int(),
  transactionId: z.string().min(1, 'Transaction ID is required'),
  amount: z.coerce.number().positive(),
  currency: z.string().min(1, 'Currency is required'),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'INSURANCE']),
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
});

export const updatePaymentSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
});

export const paymentSchema = z.object({
  paymentId: z.number().int().positive(),
});
