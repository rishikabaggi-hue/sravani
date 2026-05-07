import Message from '../models/Message.model.js';
import Room from '../models/Room.model.js';
import {
  notifyUserJoined,
  notifyUserLeft,
  notifyTyping,
  notifyStoppedTyping,
  notifyMessageReaction,
  notifyMessageDeleted,
  notifyMessagePinned,
  sendNotification,
} from '../services/notification.service.js';

export const handleChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Chat socket connected: ${socket.id}`);

    // Join a room
    socket.on('join_room', async (data) => {
      try {
        const { roomId, user } = data;

        socket.join(roomId);

        // Notify others
        notifyUserJoined(io, roomId, user);

        console.log(`User ${user.username} joined room ${roomId}`);
      } catch (error) {
        console.error('Join room error:', error);
      }
    });

    // Leave a room
    socket.on('leave_room', async (data) => {
      try {
        const { roomId, user } = data;

        socket.leave(roomId);

        // Notify others
        notifyUserLeft(io, roomId, user);

        console.log(`User ${user.username} left room ${roomId}`);
      } catch (error) {
        console.error('Leave room error:', error);
      }
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { messageId, roomId, content, sender, createdAt } = data;

        // Broadcast to room
        if (roomId) {
          io.to(roomId).emit('new_message', {
            messageId,
            content,
            sender,
            createdAt,
            reactions: [],
            replyTo: null,
            isPinned: false,
          });
        }
      } catch (error) {
        console.error('Send message error:', error);
      }
    });

    // Send private message
    socket.on('send_private_message', async (data) => {
      try {
        const { messageId, recipientId, content, sender, createdAt } = data;

        // Send to specific user
        io.to(`user_${recipientId}`).emit('new_private_message', {
          messageId,
          content,
          sender,
          createdAt,
        });

        // Send to sender as confirmation
        socket.emit('private_message_sent', {
          messageId,
          status: 'sent',
        });
      } catch (error) {
        console.error('Send private message error:', error);
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      try {
        const { roomId, user } = data;
        notifyTyping(io, roomId, user);
      } catch (error) {
        console.error('Typing error:', error);
      }
    });

    // Stopped typing
    socket.on('stop_typing', (data) => {
      try {
        const { roomId, user } = data;
        notifyStoppedTyping(io, roomId, user);
      } catch (error) {
        console.error('Stop typing error:', error);
      }
    });

    // Message reaction
    socket.on('react_message', async (data) => {
      try {
        const { messageId, roomId, emoji, user } = data;

        const message = await Message.findById(messageId).populate('sender');
        if (message) {
          notifyMessageReaction(io, roomId, message);
        }
      } catch (error) {
        console.error('React message error:', error);
      }
    });

    // Remove reaction
    socket.on('remove_reaction', async (data) => {
      try {
        const { messageId, roomId, emoji } = data;

        const message = await Message.findById(messageId);
        if (message) {
          notifyMessageReaction(io, roomId, message);
        }
      } catch (error) {
        console.error('Remove reaction error:', error);
      }
    });

    // Delete message
    socket.on('delete_message', async (data) => {
      try {
        const { messageId, roomId } = data;

        notifyMessageDeleted(io, roomId, messageId);
      } catch (error) {
        console.error('Delete message error:', error);
      }
    });

    // Pin message
    socket.on('pin_message', async (data) => {
      try {
        const { messageId, roomId } = data;

        const message = await Message.findById(messageId);
        if (message) {
          notifyMessagePinned(io, roomId, message);
        }
      } catch (error) {
        console.error('Pin message error:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Chat socket disconnected: ${socket.id}`);
    });
  });
};
