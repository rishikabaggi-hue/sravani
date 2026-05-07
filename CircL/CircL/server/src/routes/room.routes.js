import express from 'express';
import {
  createRoom,
  getRooms,
  getRoomById,
  joinRoom,
  leaveRoom,
  updateRoom,
  deleteRoom,
  getRoomMessages,
  pinMessage,
} from '../controllers/room.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { roomCreationLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// Create room
router.post('/', authenticateToken, roomCreationLimiter, createRoom);

// Get all rooms
router.get('/', authenticateToken, getRooms);

// Get room by ID
router.get('/:id', authenticateToken, getRoomById);

// Join room
router.post('/:id/join', authenticateToken, joinRoom);

// Leave room
router.post('/:id/leave', authenticateToken, leaveRoom);

// Update room
router.put('/:id', authenticateToken, updateRoom);

// Delete room
router.delete('/:id', authenticateToken, deleteRoom);

// Get room messages
router.get('/:id/messages', authenticateToken, getRoomMessages);

// Pin message
router.post('/:roomId/messages/:messageId/pin', authenticateToken, pinMessage);

export default router;
