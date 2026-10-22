const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database/connection');

class EmailVerification extends Model {}

EmailVerification.init(
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
    modelName: 'EmailVerification',
    tableName: 'auth_email_verifications',
    timestamps: true,
    underscored: true,
  }
);

module.exports = EmailVerification;
