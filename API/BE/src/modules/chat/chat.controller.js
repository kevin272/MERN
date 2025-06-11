const chatService = require('./chat.service');
const { socketInstance } = require('../../config/socket.config');

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

  // NEW/UPDATED: API to get messages for a specific guest's conversation
  getGuestMessagesByGuestId = async (req, res, next) => {
    try {
      const guestIdFromParam = req.params.guestId; // This is the UUID string
      
      // First, find the conversation based on the guestId (UUID string)
      const conversation = await chatService.getConversationByGuestId(guestIdFromParam); // New service method needed
      
      if (!conversation) {
        return res.status(404).json({
          message: 'Conversation not found for this guest.',
          result: [],
          meta: null,
        });
      }

      // Use the actual MongoDB ObjectId from the found conversation to fetch messages
      const conversationObjectId = conversation._id; 
      const messages = await chatService.getMessagesForConversation(conversationObjectId);
      
      res.json({
        result: messages,
        message: 'Guest messages fetched successfully',
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
        // Ensure conversationId is actually the MongoDB ObjectId for existing conversations
        await chatService.createOrUpdateConversation(guestId, guestName, text); // This will update existing
      }
      
      // Add the message to the conversation using the correct MongoDB ObjectId
      const message = await chatService.addMessageToConversation(currentConversationId, {
        senderId,
        senderName,
        text,
        isGuest,
      });

      // After saving to DB, notify relevant clients via Socket.io
      const io = socketInstance.getIo();
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