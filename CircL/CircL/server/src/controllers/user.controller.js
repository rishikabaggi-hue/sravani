import User from '../models/User.model.js';
import ActivityLog from '../models/ActivityLog.model.js';

export const getUsers = async (req, res) => {
  try {
    const { search, role, limit = 50, page = 1 } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      query.roles = { $in: [role] };
    }

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ reputation: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users: users.map((u) => u.toJSON()),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate([
      'blockedUsers',
      'acceptedPrivateChatRequests',
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    if (currentUser._id.toString() === id) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!currentUser.blockedUsers.includes(id)) {
      currentUser.blockedUsers.push(id);
      await currentUser.save();
    }

    // Log activity
    await ActivityLog.create({
      user: currentUser._id,
      action: 'block_user',
      targetUser: id,
      ipAddress: req.ip,
    });

    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      (u) => u.toString() !== id
    );
    await currentUser.save();

    // Log activity
    await ActivityLog.create({
      user: currentUser._id,
      action: 'unblock_user',
      targetUser: id,
      ipAddress: req.ip,
    });

    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
};

export const getBlockedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).populate('blockedUsers');

    res.json({
      blockedUsers: currentUser.blockedUsers.map((u) => u.toJSON()),
    });
  } catch (error) {
    console.error('Get blocked users error:', error);
    res.status(500).json({ error: 'Failed to get blocked users' });
  }
};

export const requestPrivateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    if (currentUser._id.toString() === id) {
      return res.status(400).json({ error: 'Cannot chat with yourself' });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (currentUser.blockedUsers.includes(id)) {
      return res.status(403).json({ error: 'You have blocked this user' });
    }

    if (targetUser.blockedUsers.includes(currentUser._id.toString())) {
      return res.status(403).json({ error: 'This user has blocked you' });
    }

    if (!targetUser.preferences.privateChatsEnabled) {
      return res.status(403).json({ error: 'User has disabled private chats' });
    }

    res.json({
      message: 'Private chat request sent',
      targetUser: targetUser.toJSON(),
    });
  } catch (error) {
    console.error('Request private chat error:', error);
    res.status(500).json({ error: 'Failed to request private chat' });
  }
};

export const acceptPrivateChatRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    const requesterUser = await User.findById(id);
    if (!requesterUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!currentUser.acceptedPrivateChatRequests.includes(id)) {
      currentUser.acceptedPrivateChatRequests.push(id);
      await currentUser.save();
    }

    res.json({
      message: 'Private chat request accepted',
      user: requesterUser.toJSON(),
    });
  } catch (error) {
    console.error('Accept private chat request error:', error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
};

export const declinePrivateChatRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    currentUser.acceptedPrivateChatRequests = currentUser.acceptedPrivateChatRequests.filter(
      (u) => u.toString() !== id
    );
    await currentUser.save();

    res.json({ message: 'Private chat request declined' });
  } catch (error) {
    console.error('Decline private chat request error:', error);
    res.status(500).json({ error: 'Failed to decline request' });
  }
};

export const getActivityLog = async (req, res) => {
  try {
    const { userId = req.user._id, limit = 50, page = 1 } = req.query;

    // Check if user is admin or viewing their own log
    if (userId !== req.user._id.toString() && !req.user.roles.includes('admin')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const skip = (page - 1) * limit;
    const logs = await ActivityLog.find({ user: userId })
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate('user', 'username displayName');

    const total = await ActivityLog.countDocuments({ user: userId });

    res.json({
      logs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get activity log error:', error);
    res.status(500).json({ error: 'Failed to get activity log' });
  }
};
