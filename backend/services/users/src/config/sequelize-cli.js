const { usersDatabaseUrl } = require('./env');

const dbUrl = usersDatabaseUrl || (
  process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST && process.env.DB_NAME
    ? `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5434}/${process.env.DB_NAME}`
    : null
);

module.exports = {
  development: {
    url: dbUrl,
    dialect: 'postgres',
    logging: false
  },
  test: {
    url: dbUrl,
    dialect: 'postgres',
    logging: false
  },
  production: {
    url: dbUrl,
    dialect: 'postgres',
    logging: false
  }
};
