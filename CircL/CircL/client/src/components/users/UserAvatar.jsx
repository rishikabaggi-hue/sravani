import React from 'react';

export const UserAvatar = ({ user, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.displayName || user.username}
        className={`${sizes[size]} rounded-full object-cover border border-[var(--outline)] shadow-md`}
      />
    );
  }

  const initials = (user.displayName || user.username)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-orange-400 text-white flex items-center justify-center font-semibold shadow-md`}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
