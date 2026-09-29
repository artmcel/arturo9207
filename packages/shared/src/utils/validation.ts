import { z } from 'zod';

export const emailSchema = z.string().email('Correo electrónico inválido');
export const passwordSchema = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres');
export const fullNameSchema = z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100);
export const cardNumberSchema = z.string().length(16, 'El número de tarjeta debe tener 16 dígitos').regex(/^\d+$/, 'Solo números');
export const cvvSchema = z.string().length(3, 'El CVV debe tener 3 dígitos').regex(/^\d+$/, 'Solo números');
export const expirySchema = z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato inválido (MM/YY)');
export const amountSchema = z.number().positive('El monto debe ser mayor a 0');

export function validateCardExpiry(expiry: string): boolean {
  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(`20${yearStr}`, 10);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (month < 1 || month > 12) return false;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateReference(): string {
  return `SNL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export function generateAuthCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}