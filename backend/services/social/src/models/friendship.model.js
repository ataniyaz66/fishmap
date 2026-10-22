module.exports = (sequelize, DataTypes) => sequelize.define(
  'Friendship',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    requesterId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'requester_id'
    },
    addresseeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'addressee_id'
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'accepted', 'declined', 'blocked']]
      }
    }
  },
  {
    tableName: 'friendships',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['requester_id', 'addressee_id']
      }
    ]
  }
);
