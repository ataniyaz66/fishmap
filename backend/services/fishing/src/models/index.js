const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const defineFishingSpot = require('./fishing-spot.model');
const defineCatch = require('./catch.model');
const defineFishingSession = require('./fishing-session.model');
const defineSpotFavorite = require('./spot-favorite.model');
const defineSpotReport = require('./spot-report.model');

const FishingSpot = defineFishingSpot(sequelize, DataTypes);
const Catch = defineCatch(sequelize, DataTypes);
const FishingSession = defineFishingSession(sequelize, DataTypes);
const SpotFavorite = defineSpotFavorite(sequelize, DataTypes);
const SpotReport = defineSpotReport(sequelize, DataTypes);

// Associations
FishingSpot.hasMany(Catch, {
  as: 'catches',
  foreignKey: 'spotId',
  onDelete: 'CASCADE'
});
Catch.belongsTo(FishingSpot, {
  as: 'spot',
  foreignKey: 'spotId'
});

FishingSession.hasMany(Catch, {
  as: 'catches',
  foreignKey: 'sessionId',
  onDelete: 'SET NULL'
});
Catch.belongsTo(FishingSession, {
  as: 'session',
  foreignKey: 'sessionId'
});

FishingSpot.hasMany(SpotFavorite, {
  as: 'favorites',
  foreignKey: 'spotId',
  onDelete: 'CASCADE'
});
SpotFavorite.belongsTo(FishingSpot, {
  as: 'spot',
  foreignKey: 'spotId'
});

FishingSpot.hasMany(SpotReport, {
  as: 'reports',
  foreignKey: 'spotId',
  onDelete: 'CASCADE'
});
SpotReport.belongsTo(FishingSpot, {
  as: 'spot',
  foreignKey: 'spotId'
});

module.exports = {
  sequelize,
  FishingSpot,
  Catch,
  FishingSession,
  SpotFavorite,
  SpotReport
};
