import { Router } from 'express';
import { reportController } from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizeRole, ROLE_NAMES } from '../middleware/authorizeRole.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createReportSchema, updateReportSchema } from '../validations/reportValidation.js';

const router = Router();

router.post('/', authenticateToken, authorizeRole(ROLE_NAMES.TEAM_MEMBER), validateRequest(createReportSchema), reportController.createReport);
router.get('/me', authenticateToken, authorizeRole(ROLE_NAMES.TEAM_MEMBER), reportController.getMyReports);
router.get('/all', authenticateToken, authorizeRole(ROLE_NAMES.MANAGER), reportController.getAllReports);
router.get('/:id', authenticateToken, reportController.getReportById);
router.put('/:id', authenticateToken, authorizeRole(ROLE_NAMES.TEAM_MEMBER, ROLE_NAMES.MANAGER), validateRequest(updateReportSchema), reportController.updateReport);
router.post('/:id/submit', authenticateToken, authorizeRole(ROLE_NAMES.TEAM_MEMBER), reportController.submitReport);

export default router;
