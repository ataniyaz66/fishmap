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
    }
  },
  {
    tableName: 'user_profiles',
    underscored: true
  }
);
