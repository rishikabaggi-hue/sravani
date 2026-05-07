import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Lock, Eye } from 'lucide-react';
import Button from '../common/Button.jsx';

export const RoomCard = ({
  room,
  onJoin,
  onSelect,
  isSelected = false,
  isMember = false,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {room.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {room.description || 'No description'}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{room.memberCount || 0} members</span>
            </div>

            {room.isTemporary && (
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Expires {new Date(room.expiresAt).toLocaleDateString()}</span>
              </div>
            )}

            {room.type === 'private' && (
              <div className="flex items-center gap-1">
                <Lock size={14} />
                <span>Private</span>
              </div>
            )}

            {room.allowAnonymous && (
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>Anonymous OK</span>
              </div>
            )}
          </div>
        </div>

        {!isMember && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onJoin?.();
            }}
            size="sm"
            variant="primary"
          >
            Join
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default RoomCard;
