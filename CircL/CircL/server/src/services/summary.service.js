import Message from '../models/Message.model.js';
import Room from '../models/Room.model.js';

export const generateRoomSummary = async (roomId) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) return null;

    const messages = await Message.find({
      room: roomId,
      isDeleted: false,
      messageType: 'text',
    })
      .populate('sender', 'username displayName')
      .sort({ createdAt: 1 });

    if (messages.length === 0) {
      return {
        roomId,
        roomName: room.name,
        totalMessages: 0,
        summary: 'No messages in this room.',
        keyPoints: [],
        participants: [],
      };
    }

    // Extract key information
    const participants = [
      ...new Set(messages.map((m) => m.sender.username)),
    ];

    // Find longer messages that might contain key points
    const keyMessages = messages
      .filter((m) => m.content.length > 50)
      .slice(0, 5);

    const keyPoints = keyMessages.map((m) => ({
      sender: m.sender.displayName || m.sender.username,
      message: m.content.substring(0, 100) + (m.content.length > 100 ? '...' : ''),
      timestamp: m.createdAt,
    }));

    // Create a basic summary
    const summary = `Room "${room.name}" has ${messages.length} messages from ${participants.length} participants. Key discussion points include messages from active members.`;

    return {
      roomId,
      roomName: room.name,
      totalMessages: messages.length,
      participants: participants.slice(0, 10),
      summary,
      keyPoints,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error('Generate summary error:', error);
    return null;
  }
};

export const generateUserActivitySummary = async (userId) => {
  try {
    const messages = await Message.find({
      sender: userId,
      isDeleted: false,
    })
      .populate('room', 'name')
      .sort({ createdAt: -1 });

    const messagesByRoom = {};
    messages.forEach((m) => {
      if (m.room) {
        const roomName = m.room.name || 'Direct Message';
        messagesByRoom[roomName] = (messagesByRoom[roomName] || 0) + 1;
      }
    });

    return {
      userId,
      totalMessages: messages.length,
      messagesByRoom,
      lastActive: messages.length > 0 ? messages[0].createdAt : null,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error('Generate user activity summary error:', error);
    return null;
  }
};
