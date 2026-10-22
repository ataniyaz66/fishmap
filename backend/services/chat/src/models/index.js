const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = require('./conversation.model')(sequelize, DataTypes);
const Message = require('./message.model')(sequelize, DataTypes);

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

module.exports = {
  sequelize,
  Conversation,
  Message
};
