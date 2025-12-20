import { z } from 'zod';

export const createInvoiceSchema = z.object({
  paymentId: z.number().int(),
  invoiceNo: z.string().min(1, 'Invoice number is required'),
  totalAmount: z.coerce.number().positive(),
  tax: z.coerce.number().nonnegative(),
  discount: z.coerce.number().nonnegative(),
  issuedAt: z.string().transform(val => new Date(val)),
  dueDate: z.string().transform(val => new Date(val)),
  status: z.enum(['UNPAID', 'PAID', 'CANCELLED']).optional(),
});

export const updateInvoiceSchema = z.object({
  tax: z.coerce.number().optional(),
  discount: z.coerce.number().optional(),
  dueDate: z
    .string()
    .transform(val => new Date(val))
    .optional(),
  status: z.enum(['UNPAID', 'PAID', 'CANCELLED']).optional(),
});

export const invoiceSchema = z.object({
  invoiceId: z.number().int().positive(),
});
