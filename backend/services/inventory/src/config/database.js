const { Sequelize } = require('sequelize');
const { inventoryDatabaseUrl } = require('./env');

if (!inventoryDatabaseUrl) {
  throw new Error(
    'Missing database environment variable: INVENTORY_DATABASE_URL'
  );
}

const sequelize = new Sequelize(inventoryDatabaseUrl, {
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
