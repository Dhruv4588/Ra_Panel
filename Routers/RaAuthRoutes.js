import express from 'express';
import { raLogin } from '../Controllers/RaAuthController.js';
import { raAuth } from '../Utils/jwt.js';
import { createTradeMessage } from '../Controllers/RaMessageController.js';

const router = express.Router();

router.post('/login', raLogin);
router.post('/messages/trade', raAuth, createTradeMessage);
router.get('/messages/my', raAuth, getMyMessages);

export default router;
