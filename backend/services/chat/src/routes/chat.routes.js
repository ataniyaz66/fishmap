const express = require('express');
const chatController = require('../controllers/chat.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/conversations')
  .post(authenticateUser, chatController.getOrCreateConversation)
  .get(authenticateUser, chatController.listConversations);

router.route('/conversations/:id/messages')
  .get(authenticateUser, chatController.getMessages)
  .post(authenticateUser, chatController.sendMessage);

router.post('/conversations/:id/read', authenticateUser, chatController.markAsRead);

module.exports = router;
