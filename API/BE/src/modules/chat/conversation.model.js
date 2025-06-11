const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  guestId: { // Unique ID for the guest (from frontend UUID)
    type: String,
    unique: true, // Ensure one conversation per guest ID
    required: true,
  },
  guestName: {
    type: String,
    required: true,
  },
  lastMessageText: {
    type: String,
    default: 'No messages yet',
  },
  lastMessageTimestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } // Add createdAt and updatedAt
});

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
