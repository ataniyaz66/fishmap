const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const defineInventoryItem = require('./inventory-item.model');

const InventoryItem = defineInventoryItem(sequelize, DataTypes);

module.exports = {
  sequelize,
  InventoryItem
};
