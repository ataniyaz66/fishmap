module.exports = (sequelize, DataTypes) => sequelize.define(
  'UserProfile',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    authUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'auth_user_id'
    },
    displayName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'display_name'
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'avatar_url'
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_public'
    }
  },
  {
    tableName: 'user_profiles',
    underscored: true
  }
);
