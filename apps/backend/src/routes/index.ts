import authRoutes from './auth';
import snailPayRoutes from './snailpay';
import { Router } from 'express';

const router = Router();

router.use('/auth', authRoutes);
router.use('/snailpay', snailPayRoutes);

export default router;