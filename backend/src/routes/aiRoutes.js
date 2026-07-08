import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = Router();

router.post('/ask', authenticateToken, aiController.ask);

export default router;
