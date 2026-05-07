import Message from '../models/Message.model.js';
import User from '../models/User.model.js';

export const notifyUserJoined = (io, roomId, user) => {
  io.to(roomId).emit('user_joined', {
    userId: user._id,
    username: user.username,
    displayName: user.displayName,
    message: `${user.displayName || user.username} joined the room`,
    timestamp: new Date(),
  });
};

export const notifyUserLeft = (io, roomId, user) => {
  io.to(roomId).emit('user_left', {
    userId: user._id,
    username: user.username,
    displayName: user.displayName,
    message: `${user.displayName || user.username} left the room`,
    timestamp: new Date(),
  });
};

export const notifyTyping = (io, roomId, user) => {
  io.to(roomId).emit('user_typing', {
    userId: user._id,
    username: user.username,
    displayName: user.displayName,
    timestamp: new Date(),
  });
};

export const notifyStoppedTyping = (io, roomId, user) => {
  io.to(roomId).emit('user_stopped_typing', {
    userId: user._id,
  });
};

export const notifyMessageReaction = (io, roomId, message) => {
  io.to(roomId).emit('message_reaction_updated', {
    messageId: message._id,
    reactions: message.reactions,
  });
};

export const notifyMessageDeleted = (io, roomId, messageId) => {
  io.to(roomId).emit('message_deleted', {
    messageId,
  });
};

export const notifyMessagePinned = (io, roomId, message) => {
  io.to(roomId).emit('message_pinned', {
    messageId: message._id,
    content: message.content,
    sender: message.sender,
  });
};

export const notifyRoomUpdated = (io, room) => {
  io.emit('room_updated', {
    roomId: room._id,
    name: room.name,
    description: room.description,
  });
};

export const sendNotification = (io, userId, notification) => {
  io.to(`user_${userId}`).emit('notification', {
    ...notification,
    timestamp: new Date(),
  });
};
