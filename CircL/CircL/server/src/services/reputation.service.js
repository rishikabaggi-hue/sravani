import User from '../models/User.model.js';

export const updateReputation = async (userId, delta) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.reputation = Math.max(0, Math.min(1000, user.reputation + delta));
    await user.save();

    return user.reputation;
  } catch (error) {
    console.error('Update reputation error:', error);
  }
};

export const calculateUserReputation = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return 0;

    // Base reputation
    let reputation = 100;

    // Reputation modifiers based on activity and behavior
    // This is a simplified model - can be expanded with more metrics

    return Math.max(0, Math.min(1000, reputation));
  } catch (error) {
    console.error('Calculate reputation error:', error);
    return 100;
  }
};

export const awardReputation = async (userId, reason, points) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.reputation = Math.min(1000, user.reputation + points);
    await user.save();

    console.log(`User ${userId} awarded ${points} reputation for: ${reason}`);
    return user.reputation;
  } catch (error) {
    console.error('Award reputation error:', error);
  }
};

export const penalizeReputation = async (userId, reason, points) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.reputation = Math.max(0, user.reputation - points);
    await user.save();

    console.log(`User ${userId} penalized ${points} reputation for: ${reason}`);
    return user.reputation;
  } catch (error) {
    console.error('Penalize reputation error:', error);
  }
};
