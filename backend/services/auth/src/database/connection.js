const { Sequelize } = require('sequelize');

const config = require('../config/env');

const sequelize = new Sequelize(config.authDatabaseUrl, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

async function connectDatabase() {
  await sequelize.authenticate();
  console.log('Auth database connection established.');
}

async function closeDatabase() {
  await sequelize.close();
}

module.exports = { sequelize, connectDatabase, closeDatabase };
