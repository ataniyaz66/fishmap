const { Conversation, Message } = require('../models');
const { Op } = require('sequelize');

function findConversationBetween(userA, userB) {
  return Conversation.findOne({
    where: {
      [Op.or]: [
        { participant1Id: userA, participant2Id: userB },
        { participant1Id: userB, participant2Id: userA }
      ]
    }
  });
}

function createConversation(userA, userB) {
  // Canonical ordering for unique index
  const [p1, p2] = [userA, userB].sort();
  return Conversation.create({
    participant1Id: p1,
    participant2Id: p2
  });
}

function findConversationById(id) {
  return Conversation.findByPk(id);
}

function listUserConversations(userId) {
  return Conversation.findAll({
    where: {
      [Op.or]: [
        { participant1Id: userId },
        { participant2Id: userId }
      ]
    },
    order: [['lastMessageAt', 'DESC NULLS LAST'], ['updatedAt', 'DESC']]
  });
}

function updateConversation(conversation, updates) {
  return conversation.update(updates);
}

function createMessage(conversationId, senderId, content) {
  return Message.create({ conversationId, senderId, content });
}

function findMessagesByConversation(conversationId, limit = 50, offset = 0) {
  const boundedLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const boundedOffset = Math.max(Number(offset) || 0, 0);
  return Message.findAndCountAll({
    where: { conversationId },
    order: [['createdAt', 'DESC']],
    limit: boundedLimit,
    offset: boundedOffset
  });
}

function markMessagesAsRead(conversationId, recipientId) {
  return Message.update(
    { read: true, readAt: new Date() },
    {
      where: {
        conversationId,
        senderId: { [Op.ne]: recipientId },
        read: false
      }
    }
  );
}

module.exports = {
  findConversationBetween,
  createConversation,
  findConversationById,
  listUserConversations,
  updateConversation,
  createMessage,
  findMessagesByConversation,
  markMessagesAsRead
};
