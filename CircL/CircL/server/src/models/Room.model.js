import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      default: '',
      maxlength: 500,
    },
    topic: {
      type: String,
      default: 'general',
      enum: ['general', 'academic', 'social', 'professional', 'support', 'other'],
    },
    type: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    isTemporary: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    rules: {
      type: String,
      default: 'Be respectful and constructive.',
      maxlength: 1000,
    },
    allowAnonymous: {
      type: Boolean,
      default: true,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
roomSchema.index({ createdAt: -1 });
roomSchema.index({ expiresAt: 1 });
roomSchema.index({ type: 1 });

export default mongoose.model('Room', roomSchema);
