import React, { createContext, useState, useCallback, useEffect } from 'react';
import { chatService } from '../services/chat.service.js';
import { socketService } from '../services/socket.service.js';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [privateChats, setPrivateChats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState({});

  const loadRooms = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatService.getRooms(params);
      setRooms(response.data.rooms);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to load rooms';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRoomMessages = useCallback(async (roomId, params = {}) => {
    try {
      const response = await chatService.getRoomMessages(roomId, params);
      setMessages(response.data.messages);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to load messages';
      setError(message);
    }
  }, []);

  const createRoom = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatService.createRoom(data);
      setRooms((prev) => [response.data.room, ...prev]);
      return response.data.room;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to create room';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const joinRoom = useCallback(async (roomId) => {
    try {
      const response = await chatService.joinRoom(roomId);
      setSelectedRoom(response.data.room);
      await loadRoomMessages(roomId);
      return response.data.room;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to join room';
      setError(message);
      throw new Error(message);
    }
  }, [loadRoomMessages]);

  const leaveRoom = useCallback(async (roomId) => {
    try {
      await chatService.leaveRoom(roomId);
      setSelectedRoom(null);
      setMessages([]);
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to leave room';
      setError(message);
    }
  }, []);

  const sendMessage = useCallback(async (data) => {
    try {
      const response = await chatService.sendMessage(data);
      const newMessage = response.data.data;

      if (data.roomId) {
        setMessages((prev) => [...prev, newMessage]);
      } else if (data.recipientId) {
        setPrivateChats((prev) => ({
          ...prev,
          [data.recipientId]: [...(prev[data.recipientId] || []), newMessage],
        }));
      }

      return newMessage;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to send message';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const editMessage = useCallback(async (messageId, content) => {
    try {
      const response = await chatService.editMessage(messageId, { content });
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? response.data.data : m))
      );
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to edit message';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const deleteMessage = useCallback(async (messageId) => {
    try {
      await chatService.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete message';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const reactToMessage = useCallback(async (messageId, emoji) => {
    try {
      const response = await chatService.reactToMessage(messageId, emoji);
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? response.data.data : m))
      );
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to add reaction';
      setError(message);
    }
  }, []);

  // Listen for socket events
  useEffect(() => {
    socketService.on('new_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socketService.on('new_private_message', (data) => {
      const senderId = data.sender._id;
      setPrivateChats((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), data],
      }));
    });

    socketService.on('user_typing', (data) => {
      setTyping((prev) => ({
        ...prev,
        [data.userId]: true,
      }));
    });

    socketService.on('user_stopped_typing', (data) => {
      setTyping((prev) => ({
        ...prev,
        [data.userId]: false,
      }));
    });

    socketService.on('user_online', (data) => {
      setOnlineUsers((prev) => [
        ...prev.filter((u) => u.userId !== data.userId),
        data,
      ]);
    });

    socketService.on('user_offline', (data) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    socketService.on('message_reaction_updated', (data) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === data.messageId ? { ...m, reactions: data.reactions } : m
        )
      );
    });

    socketService.on('message_deleted', (data) => {
      setMessages((prev) => prev.filter((m) => m._id !== data.messageId));
    });

    return () => {
      socketService.off('new_message');
      socketService.off('new_private_message');
      socketService.off('user_typing');
      socketService.off('user_stopped_typing');
      socketService.off('user_online');
      socketService.off('user_offline');
      socketService.off('message_reaction_updated');
      socketService.off('message_deleted');
    };
  }, []);

  const value = {
    rooms,
    selectedRoom,
    messages,
    privateChats,
    loading,
    error,
    onlineUsers,
    typing,
    loadRooms,
    loadRoomMessages,
    createRoom,
    joinRoom,
    leaveRoom,
    setSelectedRoom,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
