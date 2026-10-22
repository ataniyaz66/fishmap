module.exports = (sequelize, DataTypes) => sequelize.define(
  'Post',
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    photoUrls: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: 'photo_urls'
    },
    spotId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'spot_id'
    },
    catchId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'catch_id'
    },
    visibility: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'public',
      validate: {
        isIn: [['public', 'friends', 'private']]
      }
    }
  },
  {
    tableName: 'posts',
    underscored: true
  }
);
