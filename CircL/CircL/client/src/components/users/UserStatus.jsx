import React from 'react';
import { Circle } from 'lucide-react';

export const UserStatus = ({ isOnline, lastSeen }) => {
  return (
    <div className="flex items-center gap-2">
      <Circle
        size={8}
        className={`${isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`}
      />
      <span className="text-xs text-gray-600 dark:text-gray-400">
        {isOnline ? 'Online' : `Last seen ${lastSeen ? new Date(lastSeen).toLocaleTimeString() : 'offline'}`}
      </span>
    </div>
  );
};

export default UserStatus;
