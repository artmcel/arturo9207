import { Router } from 'express';
import { charge, simulateSystemError } from '../controllers/snailPayController';
import { validate } from '../middleware/validation';
import { SnailPayChargeRequestSchema } from '@shared/types';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/charge', authMiddleware, validate(SnailPayChargeRequestSchema), charge);
router.post('/simulate-system-error', simulateSystemError);

export default router;