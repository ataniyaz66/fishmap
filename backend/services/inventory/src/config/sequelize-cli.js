const { inventoryDatabaseUrl } = require('./env');

if (!inventoryDatabaseUrl) {
  throw new Error(
    'Missing database environment variable: INVENTORY_DATABASE_URL'
  );
}

module.exports = {
  development: {
    url: inventoryDatabaseUrl,
    dialect: 'postgres',
    logging: false
  }
};
