import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    validate: [array => array.length === 2, 'Chat must have exactly two participants'],
    required: true,
  },
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export const Chat = mongoose.model('Chat', chatSchema);