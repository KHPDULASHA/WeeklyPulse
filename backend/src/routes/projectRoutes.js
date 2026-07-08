import { Router } from 'express';
import { projectController } from '../controllers/projectController.js';
import { authorizeRole, ROLE_NAMES } from '../middleware/authorizeRole.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { createProjectSchema, updateProjectSchema } from '../validations/projectValidation.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', authenticateToken, authorizeRole(ROLE_NAMES.MANAGER), projectController.getAllProjects);
router.get('/:id', authenticateToken, authorizeRole(ROLE_NAMES.MANAGER), projectController.getProjectById);
router.post('/', authenticateToken, authorizeRole(ROLE_NAMES.MANAGER), validateRequest(createProjectSchema), projectController.createProject);
router.put('/:id', authenticateToken, authorizeRole(ROLE_NAMES.MANAGER), validateRequest(updateProjectSchema), projectController.updateProject);
router.delete('/:id', authenticateToken, authorizeRole(ROLE_NAMES.MANAGER), projectController.deleteProject);

export default router;
