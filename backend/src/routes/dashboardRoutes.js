import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizeRole, ROLE_NAMES } from '../middleware/authorizeRole.js';

const router = Router();

router.get('/', authenticateToken, authorizeRole(ROLE_NAMES.MANAGER), dashboardController.getManagerDashboard);

export default router;