import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import RoomCard from './RoomCard.jsx';
import Loader from '../common/Loader.jsx';

export const RoomList = ({
  rooms = [],
  selectedRoomId,
  onSelectRoom,
  onJoinRoom,
  onCreateRoom,
  loading = false,
  userRooms = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'joined') {
      return matchesSearch && userRooms.includes(room._id);
    }
    if (filter === 'available') {
      return matchesSearch && !userRooms.includes(room._id);
    }

    return matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Rooms
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateRoom}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 mt-4">
          {['all', 'joined', 'available'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <Loader />
        ) : filteredRooms.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">
            No rooms found
          </p>
        ) : (
          filteredRooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              isSelected={selectedRoomId === room._id}
              onSelect={() => onSelectRoom(room)}
              onJoin={() => onJoinRoom(room._id)}
              isMember={userRooms.includes(room._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RoomList;
