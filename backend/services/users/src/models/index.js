const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const defineUserProfile = require('./user-profile.model');

const UserProfile = defineUserProfile(sequelize, DataTypes);

module.exports = {
  sequelize,
  UserProfile
};
