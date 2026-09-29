import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { errorResponse } from '../utils/responses';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    errorResponse(res, 'UNAUTHORIZED', 'Token de autorización requerido', 401);
    return;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    errorResponse(res, 'UNAUTHORIZED', 'Token inválido o expirado', 401);
    return;
  }

  req.user = payload;
  next();
};

export const optionalAuthMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
};