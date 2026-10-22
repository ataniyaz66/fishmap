const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database/connection');

class RefreshToken extends Model {}

RefreshToken.init(
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
    familyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'family_id',
    },
    isRevoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_revoked',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'auth_refresh_tokens',
    timestamps: true,
    underscored: true,
  }
);

module.exports = RefreshToken;
