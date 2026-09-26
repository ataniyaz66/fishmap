const { fishingDatabaseUrl } = require('./env');

if (!fishingDatabaseUrl) {
  throw new Error('Missing database environment variable: FISHING_DATABASE_URL');
}

module.exports = {
  development: {
    url: fishingDatabaseUrl,
    dialect: 'postgres',
    logging: false
  }
};
