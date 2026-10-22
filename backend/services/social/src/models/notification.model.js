module.exports = (sequelize, DataTypes) => sequelize.define(
  'Notification',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },
    actorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'actor_id'
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['friend_request', 'friend_accept', 'post_like', 'post_comment']]
      }
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'entity_id'
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    tableName: 'notifications',
    underscored: true
  }
);
