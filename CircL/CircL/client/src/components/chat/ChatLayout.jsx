import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Menu, X } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import Loader from '../common/Loader.jsx';

export const ChatLayout = ({
  room,
  messages = [],
  onSendMessage,
  onTyping,
  typingUsers = [],
  loading = false,
  onRoomSettings,
  currentUser,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!room) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600 dark:text-gray-400">
        <p>Select a room to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {room.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {room.memberCount || 0} members
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <Loader />
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-600 dark:text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isSent={message.sender._id === currentUser._id}
            />
          ))
        )}

        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={onSendMessage}
        loading={loading}
        onTyping={onTyping}
      />

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          className="w-64 border-l border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 overflow-y-auto"
          initial={{ x: 256 }}
          animate={{ x: 0 }}
          exit={{ x: 256 }}
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                About
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {room.description || 'No description'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Rules
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {room.rules}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Members
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {room.memberCount} members
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatLayout;
