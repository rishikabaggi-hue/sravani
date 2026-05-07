import React from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../../utils/formatTime.js';
import { UserAvatar } from '../users/UserAvatar.jsx';

export const MessageBubble = ({
  message,
  isSent = false,
  onReact,
  onDelete,
  onReply,
  showActions = true,
}) => {
  const [showActionMenu, setShowActionMenu] = React.useState(false);

  const reactions = message.reactions || [];

  return (
    <motion.div
      className={`flex gap-3 ${isSent ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {!isSent && message.sender && (
        <UserAvatar user={message.sender} size="sm" />
      )}

      <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
        {message.sender && !isSent && (
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {message.isAnonymous ? 'Anonymous' : message.sender.displayName || message.sender.username}
          </span>
        )}

        <motion.div
          className={`px-4 py-2 rounded-lg max-w-xs ${
            isSent
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          }`}
          whileHover={{ scale: 1.02 }}
          onMouseEnter={() => showActions && setShowActionMenu(true)}
          onMouseLeave={() => setShowActionMenu(false)}
        >
          {message.replyTo && (
            <div className="text-xs opacity-70 border-l-2 pl-2 mb-2 italic">
              Replying to: {message.replyTo.content?.slice(0, 30)}...
            </div>
          )}

          <p className="text-sm break-words">{message.content}</p>

          {showActionMenu && showActions && (
            <motion.div
              className="absolute mt-2 bg-white dark:bg-gray-800 rounded shadow-lg p-2 flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => onReact?.('👍')}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded text-xs"
              >
                👍
              </button>
              {isSent && (
                <button
                  onClick={onDelete}
                  className="hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded text-xs text-red-600"
                >
                  Delete
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        <div className="flex gap-2 mt-1">
          {reactions.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {reactions.map((reaction) => (
                <div
                  key={reaction.emoji}
                  className="text-xs bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5"
                >
                  {reaction.emoji} {reaction.users.length}
                </div>
              ))}
            </div>
          )}
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
