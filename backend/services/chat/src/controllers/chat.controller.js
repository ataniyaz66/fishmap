const chatService = require('../services/chat.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  getOrCreateConversation: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const targetUserId = req.body.target_user_id || req.body.targetUserId || req.body.participant_id;
    const conversation = await chatService.getOrCreateConversation(userId, targetUserId);
    res.status(200).json({ data: conversation });
  }),

  listConversations: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await chatService.listConversations(userId);
    res.status(200).json({ data: result.conversations, total: result.total });
  }),

  sendMessage: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const conversationId = req.params.id;
    const content = req.body.content;
    const message = await chatService.sendMessage(userId, conversationId, content);
    res.status(201).json({ data: message });
  }),

  getMessages: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const conversationId = req.params.id;
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const result = await chatService.getMessages(userId, conversationId, limit, offset);
    res.status(200).json(result);
  }),

  markAsRead: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const conversationId = req.params.id;
    const result = await chatService.markConversationRead(userId, conversationId);
    res.status(200).json({ data: result });
  })
};
