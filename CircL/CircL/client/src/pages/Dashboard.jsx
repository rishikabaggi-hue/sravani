import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { useChat } from '../hooks/useSocket.js';
import { useTheme } from '../hooks/useTheme.js';
import RoomList from '../components/rooms/RoomList.jsx';
import ChatLayout from '../components/chat/ChatLayout.jsx';
import CreateRoomModal from '../components/rooms/CreateRoomModal.jsx';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import { LogOut, Moon, Sun, Menu, X } from 'lucide-react';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const {
    rooms,
    selectedRoom,
    messages,
    loading,
    loadRooms,
    setSelectedRoom,
    joinRoom,
    sendMessage,
  } = useChat();
  const { isDark, toggleTheme } = useTheme();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [userRooms, setUserRooms] = useState([]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const room = await joinRoom(roomId);
      setUserRooms((prev) => [...new Set([...prev, roomId])]);
      handleSelectRoom(room);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedRoom || !content.trim()) return;

    try {
      await sendMessage({
        content,
        roomId: selectedRoom._id,
        isAnonymous: false,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      {showSidebar && (
        <motion.div
          className="w-80 flex flex-col border-r border-gray-200 dark:border-gray-700"
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
        >
          {/* Top Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CircL
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-600"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {(user?.displayName || user?.username)
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {user?.displayName || user?.username}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Room List */}
          <RoomList
            rooms={rooms}
            selectedRoomId={selectedRoom?._id}
            onSelectRoom={handleSelectRoom}
            onJoinRoom={handleJoinRoom}
            onCreateRoom={() => setShowCreateModal(true)}
            loading={loading}
            userRooms={userRooms}
          />
        </motion.div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          >
            {showSidebar ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="font-bold flex-1">
            {selectedRoom?.name || 'CircL'}
          </h2>
        </div>

        {/* Chat */}
        {selectedRoom ? (
          <ChatLayout
            room={selectedRoom}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUser={user}
            loading={loading}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to CircL</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select a room to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRoomCreated={(room) => {
          setUserRooms((prev) => [...new Set([...prev, room._id])]);
          handleSelectRoom(room);
        }}
      />
    </div>
  );
};

export default Dashboard;
