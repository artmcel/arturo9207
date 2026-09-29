import { Router } from 'express';
import { register, login, me } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { RegisterRequestSchema, LoginRequestSchema } from '@shared/types';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', validate(RegisterRequestSchema), register);
router.post('/login', validate(LoginRequestSchema), login);
router.get('/me', authMiddleware, me);

export default router;