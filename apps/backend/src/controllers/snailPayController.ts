import { Request, Response } from 'express';
import { snailPayService } from '../services/snailPayService';
import { SnailPayChargeRequestSchema } from '@shared/types';
import { successResponse, errorResponse } from '../utils/responses';

export const charge = async (req: Request, res: Response) => {
  try {
    const data = SnailPayChargeRequestSchema.parse(req.body);
    const result = await snailPayService.charge(data, req.headers as Record<string, string | undefined>);
    return successResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 'CHARGE_ERROR', error.message, 400);
    }
    return errorResponse(res, 'CHARGE_ERROR', 'Error al procesar el cobro', 500);
  }
};

export const simulateSystemError = async (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    snailPayService.setSystemErrorMode(enabled === true);
    return successResponse(res, { systemErrorMode: enabled === true });
  } catch (error) {
    return errorResponse(res, 'ERROR', 'Error al configurar simulación', 500);
  }
};