import { handlePresenceSocket } from './presence.socket.js';
import { handleChatSocket } from './chat.socket.js';

export const initializeSockets = (io) => {
  // Initialize all socket event handlers
  handlePresenceSocket(io);
  handleChatSocket(io);

  console.log('✓ Socket.IO initialized');
};
