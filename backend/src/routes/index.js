import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import aiRoutes from './aiRoutes.js';
import projectRoutes from './projectRoutes.js';
import reportRoutes from './reportRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

router.get('/health', getHealth);
router.use('/ai', aiRoutes);
router.use('/projects', projectRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
