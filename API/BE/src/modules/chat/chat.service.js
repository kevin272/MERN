const Conversation = require('./conversation.model');
const ChatMessage = require('./chat.model');

class ChatService {
  // Find or create a conversation, and update its last message details
  createOrUpdateConversation = async (guestId, guestName, messageText) => {
    try {
      let conversation = await Conversation.findOne({ guestId: guestId });

      if (!conversation) {
        // Create new conversation if it doesn't exist
        conversation = new Conversation({
          guestId,
          guestName,
          lastMessageText: messageText,
          lastMessageTimestamp: new Date(),
        });
        await conversation.save();
        console.log(`ChatService: New conversation created for guest: ${guestId}`);
      } else {
        // Update existing conversation
        conversation.lastMessageText = messageText;
        conversation.lastMessageTimestamp = new Date();
        conversation.updatedAt = new Date(); // Explicitly update updatedAt
        await conversation.save();
        console.log(`ChatService: Conversation updated for guest: ${guestId}`);
      }
      return conversation; // Returns the full conversation object, including its _id (ObjectId)
    } catch (error) {
      console.error("ChatService: Error in createOrUpdateConversation:", error);
      throw error;
    }
  };

  // Add a message to a conversation
  addMessageToConversation = async (conversationId, messageData) => {
    try {
      // conversationId here MUST be the MongoDB ObjectId of the Conversation document
      const message = new ChatMessage({
        conversationId: conversationId,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        text: messageData.text,
        isGuest: messageData.isGuest,
        timestamp: new Date(), // Server-side timestamp for accuracy
      });
      await message.save();
      console.log(`ChatService: Message added to conversation ${conversationId}`);
      return message;
    } catch (error) {
      console.error("ChatService: Error in addMessageToConversation:", error);
      throw error;
    }
  };

  // Get all conversations for admin view
  getAdminConversations = async () => {
    try {
      // Sort by last message timestamp to show most recent chats first
      const conversations = await Conversation.find().sort({ lastMessageTimestamp: -1 });
      console.log("ChatService: Fetched admin conversations:", conversations.length);
      return conversations;
    } catch (error) {
      console.error("ChatService: Error in getAdminConversations:", error);
      throw error;
    }
  };

  // Get messages for a specific conversation
  getMessagesForConversation = async (conversationId) => {
    try {
      // conversationId here MUST be the MongoDB ObjectId of the Conversation document
      const messages = await ChatMessage.find({ conversationId: conversationId })
                                      .sort({ timestamp: 1 }); // Sort by timestamp ascending
      console.log(`ChatService: Fetched messages for conversation ${conversationId}:`, messages.length);
      return messages;
    } catch (error) {
      console.error("ChatService: Error in getMessagesForConversation:", error);
      throw error;
    }
  };

  // NEW: Get a conversation by its guestId (UUID string)
  getConversationByGuestId = async (guestId) => {
    try {
      const conversation = await Conversation.findOne({ guestId: guestId });
      console.log(`ChatService: Found conversation for guest ${guestId}:`, conversation ? 'Yes' : 'No');
      return conversation; // Returns the full conversation object or null
    } catch (error) {
      console.error("ChatService: Error in getConversationByGuestId:", error);
      throw error;
    }
  };
}

const chatService = new ChatService();
module.exports = chatService;