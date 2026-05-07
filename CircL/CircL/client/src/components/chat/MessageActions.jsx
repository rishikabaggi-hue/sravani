import React from 'react';
import { MoreVertical, Copy, Reply, Trash2, Pin } from 'lucide-react';
import { motion } from 'framer-motion';

export const MessageActions = ({
  message,
  onReply,
  onReact,
  onDelete,
  onPin,
  canDelete = false,
  canPin = false,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <MoreVertical size={16} />
      </motion.button>

      {showMenu && (
        <motion.div
          className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <button
            onClick={() => {
              onReply?.(message);
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Reply size={16} />
            Reply
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(message.content);
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Copy size={16} />
            Copy
          </button>

          {canPin && (
            <button
              onClick={() => {
                onPin?.(message);
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Pin size={16} />
              Pin
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => {
                onDelete?.(message);
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MessageActions;
