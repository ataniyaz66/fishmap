const { Sequelize } = require('sequelize');
const { fishingDatabaseUrl } = require('./env');

if (!fishingDatabaseUrl) {
  throw new Error('Missing database environment variable: FISHING_DATABASE_URL');
}

const sequelize = new Sequelize(fishingDatabaseUrl, {
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
