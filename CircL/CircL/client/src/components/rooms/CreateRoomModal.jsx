import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import { useChat } from '../../hooks/useSocket.js';

export const CreateRoomModal = ({ isOpen, onClose, onRoomCreated }) => {
  const { createRoom, loading } = useChat();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topic: 'general',
    isTemporary: false,
    expiresAt: '',
    rules: 'Be respectful and constructive.',
    allowAnonymous: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const room = await createRoom(formData);
      onRoomCreated?.(room);
      onClose();
      setFormData({
        name: '',
        description: '',
        topic: 'general',
        isTemporary: false,
        expiresAt: '',
        rules: 'Be respectful and constructive.',
        allowAnonymous: true,
      });
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Room"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !formData.name.trim()}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Room Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter room name"
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the room's purpose..."
            rows="3"
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Topic
          </label>
          <select
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General</option>
            <option value="academic">Academic</option>
            <option value="social">Social</option>
            <option value="professional">Professional</option>
            <option value="support">Support</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isTemporary"
            id="isTemporary"
            checked={formData.isTemporary}
            onChange={handleChange}
            className="rounded"
          />
          <label
            htmlFor="isTemporary"
            className="text-sm text-gray-900 dark:text-white"
          >
            Temporary room (expires)
          </label>
        </div>

        {formData.isTemporary && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Expires At
            </label>
            <input
              type="datetime-local"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allowAnonymous"
            id="allowAnonymous"
            checked={formData.allowAnonymous}
            onChange={handleChange}
            className="rounded"
          />
          <label
            htmlFor="allowAnonymous"
            className="text-sm text-gray-900 dark:text-white"
          >
            Allow anonymous messages
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default CreateRoomModal;
