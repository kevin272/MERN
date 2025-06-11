const router = require('express').Router();
const chatController = require('./chat.controller');
const { loginCheck } = require('../../middlewares/auth.middleware');
const { hasPermission } = require('../../middlewares/rbac.middleware');

const chatRouter = require('express').Router();

chatRouter.get(
  '/admin/conversations',
  loginCheck,
  hasPermission(['admin']), // Only admins can see all conversations
  chatController.getAdminConversations
);

chatRouter.get(
  '/conversations/:conversationId/messages',
  loginCheck,
  chatController.getMessagesByConversationId
);

// Route for sending messages (can be used by guests and admins)
chatRouter.get(
  '/guest/conversations/:guestId/messages',
  chatController.getGuestMessagesByGuestId 
);

chatRouter.post(
  '/message',

  chatController.sendMessage
);

module.exports = chatRouter;
