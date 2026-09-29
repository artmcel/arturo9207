import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { RegisterRequestSchema, LoginRequestSchema } from '@shared/types';
import { successResponse, errorResponse } from '../utils/responses';

export const register = async (req: Request, res: Response) => {
  try {
    const data = RegisterRequestSchema.parse(req.body);
    const result = await authService.register(data);
    return successResponse(res, result, 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 'REGISTRATION_ERROR', error.message, 400);
    }
    return errorResponse(res, 'REGISTRATION_ERROR', 'Error al registrar usuario', 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = LoginRequestSchema.parse(req.body);
    const result = await authService.login(data);
    return successResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 'LOGIN_ERROR', error.message, 401);
    }
    return errorResponse(res, 'LOGIN_ERROR', 'Error al iniciar sesión', 500);
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return errorResponse(res, 'UNAUTHORIZED', 'Usuario no autenticado', 401);
    }
    const user = await authService.getUserById(req.user.sub);
    if (!user) {
      return errorResponse(res, 'NOT_FOUND', 'Usuario no encontrado', 404);
    }
    return successResponse(res, user);
  } catch (error) {
    return errorResponse(res, 'ERROR', 'Error al obtener usuario', 500);
  }
};