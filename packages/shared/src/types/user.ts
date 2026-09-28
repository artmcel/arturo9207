import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  passwordHash: z.string(),
  balance: z.number().nonnegative(),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const UserPublicSchema = UserSchema.omit({ passwordHash: true });
export type UserPublic = z.infer<typeof UserPublicSchema>;

export const RegisterRequestSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const AuthResponseSchema = z.object({
  user: UserPublicSchema,
  token: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const JWTPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  iat: z.number(),
  exp: z.number(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;