const router = require('express').Router();
const chatController = require('./chat.controller');
const { loginCheck } = require('../../middlewares/auth.middleware');
const { hasPermission } = require('../../middlewares/rbac.middleware');

const chatRouter = require('express').Router();

// Routes for getting conversations and messages (protected)
chatRouter.get(
  '/admin/conversations',
  loginCheck,
  hasPermission(['admin']), // Only admins can see all conversations
  chatController.getAdminConversations
);

chatRouter.get(
  '/conversations/:conversationId/messages',
  loginCheck, // Authenticated users can fetch messages from their conversations
  // Add more granular permission if needed (e.g., only guest can fetch their own, admin can fetch any)
  // For now, any logged-in user can fetch messages if they know the conversationId.
  chatController.getMessagesByConversationId
);

// Route for sending messages (can be used by guests and admins)
chatRouter.get(
  '/guest/conversations/:guestId/messages', // Use a distinct path
  // NO loginCheck here as guests are unauthenticated
  chatController.getGuestMessagesByGuestId // A new controller method
);

chatRouter.post(
  '/message',
  // loginCheck is optional here. If you want guests (unauthenticated) to send messages, remove loginCheck.
  // If you want all messages to be tied to a logged-in user, keep loginCheck.
  // For guest chat, loginCheck should NOT be here.
  // For admin sending messages, loginCheck should be present.
  // A better approach is to have two separate send message endpoints or handle auth within the controller.
  // For simplicity, let's keep it open for guests and assume senderId/isGuest validates.
  // loginCheck, // Re-enable for authenticated users if desired
  chatController.sendMessage
);

module.exports = chatRouter;
