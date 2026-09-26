const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const defineFishingSpot = require('./fishing-spot.model');
const defineCatch = require('./catch.model');

const FishingSpot = defineFishingSpot(sequelize, DataTypes);
const Catch = defineCatch(sequelize, DataTypes);

FishingSpot.hasMany(Catch, {
  as: 'catches',
  foreignKey: 'spotId',
  onDelete: 'CASCADE'
});
Catch.belongsTo(FishingSpot, {
  as: 'spot',
  foreignKey: 'spotId'
});

module.exports = {
  sequelize,
  FishingSpot,
  Catch
};
