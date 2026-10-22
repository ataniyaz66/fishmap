module.exports = (sequelize, DataTypes) => sequelize.define(
  'Conversation',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    participant1Id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'participant_1_id'
    },
    participant2Id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'participant_2_id'
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_message_at'
    }
  },
  {
    tableName: 'conversations',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['participant_1_id', 'participant_2_id']
      }
    ]
  }
);
