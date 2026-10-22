const { Sequelize } = require('sequelize');
const { usersDatabaseUrl, nodeEnv } = require('./env');

const dbUrl = usersDatabaseUrl || (
  process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST && process.env.DB_NAME
    ? `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5434}/${process.env.DB_NAME}`
    : (nodeEnv === 'production' ? null : 'postgresql://fishmap_users:fishmap_users_dev_password@localhost:5434/fishmap_users')
);

if (!dbUrl) {
  throw new Error('Missing database configuration: USERS_DATABASE_URL is required in production.');
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
