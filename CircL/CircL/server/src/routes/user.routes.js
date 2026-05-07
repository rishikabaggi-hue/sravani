import express from 'express';
import {
  getUsers,
  getUserById,
  blockUser,
  unblockUser,
  getBlockedUsers,
  requestPrivateChat,
  acceptPrivateChatRequest,
  declinePrivateChatRequest,
  getActivityLog,
} from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all users
router.get('/', authenticateToken, getUsers);

// Get user by ID
router.get('/:id', authenticateToken, getUserById);

// Block user
router.post('/:id/block', authenticateToken, blockUser);

// Unblock user
router.delete('/:id/unblock', authenticateToken, unblockUser);

// Get blocked users
router.get('/blocked/list', authenticateToken, getBlockedUsers);

// Request private chat
router.post('/:id/request-chat', authenticateToken, requestPrivateChat);

// Accept private chat request
router.post('/:id/accept-chat', authenticateToken, acceptPrivateChatRequest);

// Decline private chat request
router.delete('/:id/decline-chat', authenticateToken, declinePrivateChatRequest);

// Get activity log
router.get('/activity-log/list', authenticateToken, getActivityLog);

export default router;
