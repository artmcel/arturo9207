import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils/responses';

export const validate = (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.reduce((acc, err) => {
          const path = err.path.join('.');
          acc[path] = err.message;
          return acc;
        }, {} as Record<string, string>);
        return errorResponse(res, 'VALIDATION_ERROR', 'Datos de entrada inválidos', 400, details);
      }
      return errorResponse(res, 'VALIDATION_ERROR', 'Error de validación', 400);
    }
  };