import api from './api.js';

export const chatService = {
  getRooms: (params = {}) =>
    api.get('/rooms', { params }),

  getRoomById: (roomId) =>
    api.get(`/rooms/${roomId}`),

  createRoom: (data) =>
    api.post('/rooms', data),

  joinRoom: (roomId) =>
    api.post(`/rooms/${roomId}/join`),

  leaveRoom: (roomId) =>
    api.post(`/rooms/${roomId}/leave`),

  updateRoom: (roomId, data) =>
    api.put(`/rooms/${roomId}`, data),

  deleteRoom: (roomId) =>
    api.delete(`/rooms/${roomId}`),

  getRoomMessages: (roomId, params = {}) =>
    api.get(`/rooms/${roomId}/messages`, { params }),

  sendMessage: (data) =>
    api.post('/messages', data),

  editMessage: (messageId, data) =>
    api.put(`/messages/${messageId}`, data),

  deleteMessage: (messageId) =>
    api.delete(`/messages/${messageId}`),

  reactToMessage: (messageId, emoji) =>
    api.post(`/messages/${messageId}/react`, { emoji }),

  removeReaction: (messageId, emoji) =>
    api.delete(`/messages/${messageId}/react`, { data: { emoji } }),

  getPrivateMessages: (recipientId, params = {}) =>
    api.get(`/messages/private/${recipientId}`, { params }),
};
