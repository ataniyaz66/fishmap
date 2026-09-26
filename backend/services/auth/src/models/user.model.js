const { DataTypes, Model } = require('sequelize');

const { sequelize } = require('../database/connection');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [3, 30],
        is: /^[A-Za-z0-9_]+$/,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    accountStatus: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
      field: 'account_status',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'auth_users',
    timestamps: true,
    underscored: true,
  },
);

module.exports = User;
