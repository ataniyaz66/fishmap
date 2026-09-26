const config = require('./env');

const databaseConfig = {
  url: config.authDatabaseUrl,
  dialect: 'postgres',
  logging: false,
  migrationStorageTableName: 'sequelize_meta',
};

module.exports = {
  development: databaseConfig,
  test: databaseConfig,
  production: databaseConfig,
};
