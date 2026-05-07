import Message from '../models/Message.model.js';
import Room from '../models/Room.model.js';
import User from '../models/User.model.js';
import ActivityLog from '../models/ActivityLog.model.js';

export const sendMessage = async (req, res) => {
  try {
    const { content, roomId, recipientId, replyToId, isAnonymous = false } = req.body;
    const user = req.user;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    let message;

    if (roomId) {
      // Room message
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      if (!room.members.includes(user._id)) {
        return res.status(403).json({ error: 'You are not a member of this room' });
      }

      if (room.isTemporary && new Date() > room.expiresAt) {
        return res.status(410).json({ error: 'Room has expired' });
      }

      message = new Message({
        content,
        sender: user._id,
        room: roomId,
        messageType: 'text',
        isAnonymous: isAnonymous && room.allowAnonymous,
      });

      room.messageCount = (room.messageCount || 0) + 1;
      await room.save();
    } else if (recipientId) {
      // Private message
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
      }

      if (user.blockedUsers.includes(recipientId)) {
        return res.status(403).json({ error: 'You have blocked this user' });
      }

      if (recipient.blockedUsers.includes(user._id.toString())) {
        return res.status(403).json({ error: 'This user has blocked you' });
      }

      if (!recipient.preferences.privateChatsEnabled) {
        return res.status(403).json({ error: 'User has disabled private chats' });
      }

      message = new Message({
        content,
        sender: user._id,
        recipient: recipientId,
        messageType: 'text',
        isAnonymous: false,
      });
    } else {
      return res.status(400).json({ error: 'Room ID or recipient ID required' });
    }

    if (replyToId) {
      const replyTo = await Message.findById(replyToId);
      if (replyTo) {
        message.replyTo = replyToId;
      }
    }

    await message.save();

    // Populate sender data
    await message.populate('sender', 'username displayName avatar isOnline');
    await message.populate('replyTo');

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'send_message',
      room: roomId || null,
      targetUser: recipientId || null,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== user._id.toString() && !user.roles.includes('admin')) {
      return res.status(403).json({ error: 'You can only edit your own messages' });
    }

    message.content = content;
    message.editedAt = new Date();
    await message.save();

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'edit_message',
      room: message.room || null,
      ipAddress: req.ip,
    });

    res.json({
      message: 'Message updated successfully',
      data: message,
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ error: 'Failed to edit message' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== user._id.toString() && !user.roles.includes('admin')) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }

    message.isDeleted = true;
    message.content = '[Message deleted]';
    await message.save();

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'delete_message',
      room: message.room || null,
      ipAddress: req.ip,
    });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

export const reactToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;
    const user = req.user;

    if (!emoji) {
      return res.status(400).json({ error: 'Emoji is required' });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    let reaction = message.reactions.find((r) => r.emoji === emoji);

    if (!reaction) {
      reaction = { emoji, users: [] };
      message.reactions.push(reaction);
    }

    if (!reaction.users.includes(user._id)) {
      reaction.users.push(user._id);
    }

    await message.save();

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'react_message',
      room: message.room || null,
      ipAddress: req.ip,
    });

    res.json({
      message: 'Reaction added successfully',
      data: message,
    });
  } catch (error) {
    console.error('React to message error:', error);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
};

export const removeReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;
    const user = req.user;

    if (!emoji) {
      return res.status(400).json({ error: 'Emoji is required' });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const reaction = message.reactions.find((r) => r.emoji === emoji);
    if (reaction) {
      reaction.users = reaction.users.filter((u) => u.toString() !== user._id.toString());

      if (reaction.users.length === 0) {
        message.reactions = message.reactions.filter((r) => r.emoji !== emoji);
      }
    }

    await message.save();

    res.json({
      message: 'Reaction removed successfully',
      data: message,
    });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({ error: 'Failed to remove reaction' });
  }
};

export const getPrivateMessages = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const { limit = 50, page = 1 } = req.query;
    const user = req.user;

    const skip = (page - 1) * limit;

    const messages = await Message.find({
      isDeleted: false,
      $or: [
        { sender: user._id, recipient: recipientId },
        { sender: recipientId, recipient: user._id },
      ],
    })
      .populate('sender', 'username displayName avatar isOnline')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Message.countDocuments({
      isDeleted: false,
      $or: [
        { sender: user._id, recipient: recipientId },
        { sender: recipientId, recipient: user._id },
      ],
    });

    res.json({
      messages: messages.reverse(),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get private messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};
