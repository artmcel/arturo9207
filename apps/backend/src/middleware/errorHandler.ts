import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/responses';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    const details = err.errors.reduce((acc, e) => {
      const path = e.path.join('.');
      acc[path] = e.message;
      return acc;
    }, {} as Record<string, string>);
    return errorResponse(res, 'VALIDATION_ERROR', 'Datos de entrada inválidos', 400, details);
  }

  if (err instanceof AppError) {
    return errorResponse(res, err.code, err.message, err.statusCode, err.details);
  }

  return errorResponse(res, 'INTERNAL_ERROR', 'Error interno del servidor', 500);
};

export const notFoundHandler = (req: Request, res: Response) => {
  errorResponse(res, 'NOT_FOUND', `Ruta ${req.method} ${req.path} no encontrada`, 404);
};