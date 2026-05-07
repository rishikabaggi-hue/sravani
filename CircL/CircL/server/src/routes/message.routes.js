import express from 'express';
import {
  sendMessage,
  editMessage,
  deleteMessage,
  reactToMessage,
  removeReaction,
  getPrivateMessages,
} from '../controllers/message.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { messageLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// Send message
router.post('/', authenticateToken, messageLimiter, sendMessage);

// Edit message
router.put('/:id', authenticateToken, editMessage);

// Delete message
router.delete('/:id', authenticateToken, deleteMessage);

// React to message
router.post('/:id/react', authenticateToken, reactToMessage);

// Remove reaction
router.delete('/:id/react', authenticateToken, removeReaction);

// Get private messages
router.get('/private/:recipientId', authenticateToken, getPrivateMessages);

export default router;
