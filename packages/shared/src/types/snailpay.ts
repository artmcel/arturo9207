import { z } from 'zod';

export const SnailPayChargeRequestSchema = z.object({
  cardNumber: z.string().length(16, 'El número de tarjeta debe tener 16 dígitos'),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Formato de fecha inválido (MM/YY)'),
  cvv: z.string().length(3, 'El CVV debe tener 3 dígitos'),
  fullName: z.string().min(1, 'El nombre es requerido'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  userId: z.string().uuid(),
  userEmail: z.string().email(),
});

export type SnailPayChargeRequest = z.infer<typeof SnailPayChargeRequestSchema>;

export const SnailPayResponseSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['approved', 'rejected', 'error']),
  status_detail: z.string(),
  transaction_amount: z.number().positive(),
  date_created: z.string().datetime(),
  authorization_code: z.string().nullable(),
  reference: z.string(),
  payer_id: z.string().uuid(),
  payer_email: z.string().email(),
});

export type SnailPayResponse = z.infer<typeof SnailPayResponseSchema>;

export const SnailPayStatus = {
  APPROVED: 'approved' as const,
  REJECTED: 'rejected' as const,
  ERROR: 'error' as const,
} as const;

export type SnailPayStatus = typeof SnailPayStatus[keyof typeof SnailPayStatus];