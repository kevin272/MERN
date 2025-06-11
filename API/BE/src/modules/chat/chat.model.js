const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  conversationId: { // Link to the conversation
    type: mongoose.Types.ObjectId,
    ref: 'Conversation', // Reference to the Conversation model
    required: true,
  },
  senderId: { // The ID of the user (guestId or adminId) who sent the message
    type: String, // Keep as String since guestId is UUID
    required: true,
  },
  senderName: { // The name of the sender
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isGuest: { // True if sent by a guest, false if by an admin
    type: Boolean,
    default: false,
  },
  timestamp: { // Server-side timestamp for reliability
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } // Add createdAt and updatedAt
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
module.exports = ChatMessage;
