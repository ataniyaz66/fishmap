module.exports = (sequelize, DataTypes) => sequelize.define(
  'Message',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'conversation_id'
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'sender_id'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'read_at'
    }
  },
  {
    tableName: 'messages',
    underscored: true
  }
);
