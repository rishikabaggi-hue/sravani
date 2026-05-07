export const canDeleteMessage = (messageSender, currentUser) => {
  return (
    messageSender._id === currentUser._id ||
    currentUser.roles.includes('admin')
  );
};

export const canEditMessage = (messageSender, currentUser) => {
  return (
    messageSender._id === currentUser._id ||
    currentUser.roles.includes('admin')
  );
};

export const canPinMessage = (user) => {
  return user.roles.includes('moderator') || user.roles.includes('admin');
};

export const canModerateRoom = (user) => {
  return user.roles.includes('moderator') || user.roles.includes('admin');
};

export const isAdmin = (user) => {
  return user?.roles?.includes('admin');
};

export const isModerator = (user) => {
  return (
    user?.roles?.includes('moderator') ||
    user?.roles?.includes('admin')
  );
};

export const canSendPrivateMessage = (user) => {
  return user && user.preferences?.privateChatsEnabled !== false;
};
