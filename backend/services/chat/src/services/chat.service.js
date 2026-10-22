const chatRepository = require('../repositories/chat.repository');
const AppError = require('../utils/app-error');

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUuid(value, field) {
  if (typeof value !== 'string' || !uuidPattern.test(value)) {
    throw new AppError(`${field} must be a valid UUID`, 400);
  }
}

async function getOrCreateConversation(userId, targetUserId) {
  validateUuid(userId, 'userId');
  validateUuid(targetUserId, 'targetUserId');

  if (userId.toLowerCase() === targetUserId.toLowerCase()) {
    throw new AppError('Cannot start a conversation with yourself', 400);
  }

  const existing = await chatRepository.findConversationBetween(userId, targetUserId);
  if (existing) {
    return existing;
  }

  return chatRepository.createConversation(userId, targetUserId);
}

async function listConversations(userId) {
  validateUuid(userId, 'userId');
  const conversations = await chatRepository.listUserConversations(userId);
  return { conversations, total: conversations.length };
}

async function verifyParticipant(conversationId, userId) {
  validateUuid(conversationId, 'conversationId');
  validateUuid(userId, 'userId');

  const conversation = await chatRepository.findConversationById(conversationId);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  const isParticipant =
    conversation.participant1Id.toLowerCase() === userId.toLowerCase() ||
    conversation.participant2Id.toLowerCase() === userId.toLowerCase();

  if (!isParticipant) {
    throw new AppError('You are not a participant in this conversation', 403);
  }

  return conversation;
}

async function sendMessage(userId, conversationId, content) {
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    throw new AppError('Message content is required and cannot be empty', 400);
  }

  const conversation = await verifyParticipant(conversationId, userId);

  const message = await chatRepository.createMessage(conversationId, userId, content.trim());
  await chatRepository.updateConversation(conversation, { lastMessageAt: new Date() });

  return message;
}

async function getMessages(userId, conversationId, limit = 50, offset = 0) {
  await verifyParticipant(conversationId, userId);
  const result = await chatRepository.findMessagesByConversation(conversationId, limit, offset);

  return {
    messages: result.rows,
    total: result.count,
    limit,
    offset
  };
}

async function markConversationRead(userId, conversationId) {
  await verifyParticipant(conversationId, userId);
  await chatRepository.markMessagesAsRead(conversationId, userId);
  return { success: true };
}

module.exports = {
  getOrCreateConversation,
  listConversations,
  sendMessage,
  getMessages,
  markConversationRead
};
