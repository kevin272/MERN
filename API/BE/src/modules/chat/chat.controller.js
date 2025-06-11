const chatService = require('./chat.service');
const { socketInstance } = require('../../config/socket.config');
const { getIo } = require('../../config/socket.config');

class ChatController {
  // API to get all conversations for admin dashboard
  getAdminConversations = async (req, res, next) => {
    try {
      const conversations = await chatService.getAdminConversations();
      res.json({
        result: conversations,
        message: 'Admin conversations fetched successfully',
        meta: null,
      });
    } catch (exception) {
      console.error("ChatController: Error fetching admin conversations:", exception);
      next(exception);
    }
  };

  // API to get messages for a specific conversation (for authenticated users/admins)
  getMessagesByConversationId = async (req, res, next) => {
    try {
      const conversationId = req.params.conversationId;
      const messages = await chatService.getMessagesForConversation(conversationId);
      res.json({
        result: messages,
        message: 'Messages fetched successfully',
        meta: null,
      });
    } catch (exception) {
      console.error("ChatController: Error fetching messages by conversation ID:", exception);
      next(exception);
    }
  };

  getGuestMessagesByGuestId = async (req, res, next) => {
  try {
    const guestIdFromParam = req.params.guestId; // UUID string
    
    // Try to find existing conversation
    let conversation = await chatService.getConversationByGuestId(guestIdFromParam);
    
    // If no conversation, create a new one with default guestName and empty last message
    if (!conversation) {
      conversation = await chatService.createOrUpdateConversation(guestIdFromParam, 'Guest', '');
    }

    // Fetch messages for the conversation (will be empty if new)
    const messages = await chatService.getMessagesForConversation(conversation._id);
    
    res.json({
      result: messages,
      message: conversation.lastMessageText ? 'Guest messages fetched successfully' : 'New conversation created',
      meta: null,
    });
  } catch (exception) {
    console.error("ChatController: Error fetching guest messages:", exception);
    next(exception);
  }
};

  // API to send a message (and potentially create/update conversation)
  sendMessage = async (req, res, next) => {
    try {
      const { conversationId, guestId, guestName, senderId, senderName, text, isGuest } = req.body;
      let currentConversationId = conversationId;

      // For initial guest message, create or update conversation and get its _id
      if (isGuest && !conversationId) {
        const conversation = await chatService.createOrUpdateConversation(guestId, guestName, text);
        currentConversationId = conversation._id; // This will be the MongoDB ObjectId
      } else if (isGuest && conversationId) {
        // If conversationId is provided by guest (e.g., continuing a session), update last message text
        await chatService.createOrUpdateConversation(guestId, guestName, text); 
      }
      
      // Add the message to the conversation using the correct MongoDB ObjectId
      const message = await chatService.addMessageToConversation(currentConversationId, {
        senderId,
        senderName,
        text,
        isGuest,
      });

      // After saving to DB, notify relevant clients via Socket.io
      const io = getIo();
      if (io) {
        // Notify the specific conversation room to refresh messages
        io.to(currentConversationId.toString()).emit('messageUpdateNotification', {
          conversationId: currentConversationId.toString(),
          messageId: message._id.toString(), // Pass the new message ID
        });

        // If it's a guest message, notify all admins that a new guest conversation (or update) occurred
        if (isGuest) {
          const adminInboxRoom = 'admin_inbox';
          io.to(adminInboxRoom).emit('newGuestMessageNotification', {
            conversationId: currentConversationId.toString(),
            guestId: guestId,
            guestName: guestName,
            preview: text,
            timestamp: new Date().toISOString(),
          });
        }
      }

      res.status(201).json({
        result: message,
        message: 'Message sent successfully',
        meta: null,
      });
    } catch (exception) {
      console.error("ChatController: Error sending message:", exception);
      next(exception);
    }
  };
}

const chatController = new ChatController();
module.exports = chatController;