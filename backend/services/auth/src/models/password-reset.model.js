const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database/connection');

class PasswordReset extends Model {}

PasswordReset.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    tokenHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: 'token_hash',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_used',
    },
  },
  {
    sequelize,
    modelName: 'PasswordReset',
    tableName: 'auth_password_resets',
    timestamps: true,
    underscored: true,
  }
);

module.exports = PasswordReset;
