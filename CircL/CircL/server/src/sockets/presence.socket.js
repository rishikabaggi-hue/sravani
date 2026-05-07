import User from '../models/User.model.js';
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

const userSockets = {};

export const handlePresenceSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user login
    socket.on('user_login', async (data) => {
      try {
        const { userId } = data;
        userSockets[userId] = socket.id;

        // Update user status
        const user = await User.findByIdAndUpdate(
          userId,
          { isOnline: true, lastSeen: new Date() },
          { new: true }
        );

        // Join user-specific room for private notifications
        socket.join(`user_${userId}`);

        // Broadcast user is online
        io.emit('user_online', {
          userId,
          username: user.username,
          displayName: user.displayName,
        });

        console.log(`User ${userId} is now online`);
      } catch (error) {
        console.error('User login error:', error);
      }
    });

    // Handle user logout
    socket.on('user_logout', async (data) => {
      try {
        const { userId } = data;

        // Update user status
        const user = await User.findByIdAndUpdate(
          userId,
          { isOnline: false, lastSeen: new Date() },
          { new: true }
        );

        delete userSockets[userId];

        // Broadcast user is offline
        io.emit('user_offline', {
          userId,
          username: user.username,
          displayName: user.displayName,
        });

        socket.leave(`user_${userId}`);
        console.log(`User ${userId} is now offline`);
      } catch (error) {
        console.error('User logout error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      try {
        const userId = Object.keys(userSockets).find(
          (key) => userSockets[key] === socket.id
        );

        if (userId) {
          const user = await User.findByIdAndUpdate(
            userId,
            { isOnline: false, lastSeen: new Date() },
            { new: true }
          );

          delete userSockets[userId];

          io.emit('user_offline', {
            userId,
            username: user.username,
            displayName: user.displayName,
          });

          console.log(`User ${userId} disconnected`);
        }
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });

    // Get online users
    socket.on('get_online_users', async () => {
      try {
        const onlineUsers = await User.find({ isOnline: true }).select(
          'username displayName avatar'
        );
        socket.emit('online_users', { users: onlineUsers });
      } catch (error) {
        console.error('Get online users error:', error);
      }
    });
  });
};

export const getUserSocketId = (userId) => {
  return userSockets[userId];
};

export const isUserOnline = (userId) => {
  return !!userSockets[userId];
};
