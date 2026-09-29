import { Response } from 'express';
import { ApiResponse } from '@sisu/shared';

export function successResponse<T>(res: Response, data: T, statusCode = 200): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    error: null,
  };
  return res.status(statusCode).json(response);
}

export function errorResponse(
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
  details?: Record<string, unknown>
): Response {
  const response: ApiResponse<null> = {
    success: false,
    data: null,
    error: { code, message, details },
  };
  return res.status(statusCode).json(response);
}