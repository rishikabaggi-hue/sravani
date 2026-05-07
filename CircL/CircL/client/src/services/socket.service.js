import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const socketService = {
  connect: (userId) => {
    if (socket?.connected) return socket;

    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✓ Socket connected');
      socket.emit('user_login', { userId });
    });

    socket.on('disconnect', () => {
      console.log('✗ Socket disconnected');
    });

    return socket;
  },

  disconnect: (userId) => {
    if (socket) {
      socket.emit('user_logout', { userId });
      socket.disconnect();
      socket = null;
    }
  },

  joinRoom: (roomId, user) => {
    socket?.emit('join_room', { roomId, user });
  },

  leaveRoom: (roomId, user) => {
    socket?.emit('leave_room', { roomId, user });
  },

  sendMessage: (data) => {
    socket?.emit('send_message', data);
  },

  sendPrivateMessage: (data) => {
    socket?.emit('send_private_message', data);
  },

  typing: (roomId, user) => {
    socket?.emit('typing', { roomId, user });
  },

  stopTyping: (roomId, user) => {
    socket?.emit('stop_typing', { roomId, user });
  },

  reactMessage: (data) => {
    socket?.emit('react_message', data);
  },

  removeReaction: (data) => {
    socket?.emit('remove_reaction', data);
  },

  deleteMessage: (data) => {
    socket?.emit('delete_message', data);
  },

  pinMessage: (data) => {
    socket?.emit('pin_message', data);
  },

  on: (event, callback) => {
    socket?.on(event, callback);
  },

  off: (event, callback) => {
    socket?.off(event, callback);
  },

  getSocket: () => socket,
};
