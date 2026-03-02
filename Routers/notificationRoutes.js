import express from 'express';
import { getQueueStatus } from '../Controllers/RaMessageController.js';
import { raAuth } from '../middleware/auth.js';

const router = express.Router();
router.get('/queue-status', raAuth, getQueueStatus);

export default router;
