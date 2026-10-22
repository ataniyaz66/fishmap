module.exports = (sequelize, DataTypes) => sequelize.define(
  'Like',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'post_id'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    }
  },
  {
    tableName: 'likes',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['post_id', 'user_id']
      }
    ]
  }
);
