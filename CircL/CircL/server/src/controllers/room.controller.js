import Room from '../models/Room.model.js';
import Message from '../models/Message.model.js';
import ActivityLog from '../models/ActivityLog.model.js';

export const createRoom = async (req, res) => {
  try {
    const { name, description, topic, isTemporary, expiresAt, rules, allowAnonymous } = req.body;
    const user = req.user;

    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const room = new Room({
      name,
      description: description || '',
      topic: topic || 'general',
      isTemporary: isTemporary || false,
      expiresAt: isTemporary && expiresAt ? new Date(expiresAt) : null,
      createdBy: user._id,
      members: [user._id],
      moderators: [user._id],
      rules: rules || 'Be respectful and constructive.',
      allowAnonymous: allowAnonymous !== false,
      memberCount: 1,
    });

    await room.save();

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'create_room',
      room: room._id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

export const getRooms = async (req, res) => {
  try {
    const { search, topic, type = 'public', limit = 50, page = 1, sortBy = 'createdAt' } = req.query;

    let query = {
      type: type || 'public',
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (topic) {
      query.topic = topic;
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy === 'memberCount' ? 'memberCount' : 'createdAt'] = -1;

    const rooms = await Room.find(query)
      .populate('createdBy', 'username displayName avatar')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortOptions);

    const total = await Room.countDocuments(query);

    res.json({
      rooms,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Failed to get rooms' });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id)
      .populate('createdBy', 'username displayName avatar')
      .populate('members', 'username displayName avatar isOnline')
      .populate('moderators', 'username displayName avatar');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Failed to get room' });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.isTemporary && new Date() > room.expiresAt) {
      return res.status(410).json({ error: 'Room has expired' });
    }

    if (!room.members.includes(user._id)) {
      room.members.push(user._id);
      room.memberCount = room.members.length;
      await room.save();
    }

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'join_room',
      room: room._id,
      ipAddress: req.ip,
    });

    res.json({
      message: 'Joined room successfully',
      room,
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    room.members = room.members.filter((m) => m.toString() !== user._id.toString());
    room.moderators = room.moderators.filter((m) => m.toString() !== user._id.toString());
    room.memberCount = room.members.length;
    await room.save();

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'leave_room',
      room: room._id,
      ipAddress: req.ip,
    });

    res.json({ message: 'Left room successfully' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ error: 'Failed to leave room' });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, rules, allowAnonymous } = req.body;
    const user = req.user;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user is moderator
    if (!room.moderators.includes(user._id) && !user.roles.includes('admin')) {
      return res.status(403).json({ error: 'Only moderators can update this room' });
    }

    if (name) room.name = name;
    if (description !== undefined) room.description = description;
    if (rules !== undefined) room.rules = rules;
    if (allowAnonymous !== undefined) room.allowAnonymous = allowAnonymous;

    await room.save();

    res.json({
      message: 'Room updated successfully',
      room,
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user is creator or admin
    if (room.createdBy.toString() !== user._id.toString() && !user.roles.includes('admin')) {
      return res.status(403).json({ error: 'Only room creator or admin can delete' });
    }

    // Delete all messages in the room
    await Message.deleteMany({ room: id });

    await Room.findByIdAndDelete(id);

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'delete_room',
      details: { roomName: room.name },
      ipAddress: req.ip,
    });

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

export const getRoomMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const skip = (page - 1) * limit;
    const messages = await Message.find({ room: id, isDeleted: false })
      .populate('sender', 'username displayName avatar isOnline')
      .populate('replyTo')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Message.countDocuments({ room: id, isDeleted: false });

    res.json({
      messages: messages.reverse(),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get room messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

export const pinMessage = async (req, res) => {
  try {
    const { roomId, messageId } = req.params;
    const user = req.user;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.moderators.includes(user._id) && !user.roles.includes('admin')) {
      return res.status(403).json({ error: 'Only moderators can pin messages' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.isPinned = true;
    await message.save();

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'pin_message',
      room: roomId,
      ipAddress: req.ip,
    });

    res.json({ message: 'Message pinned successfully' });
  } catch (error) {
    console.error('Pin message error:', error);
    res.status(500).json({ error: 'Failed to pin message' });
  }
};
