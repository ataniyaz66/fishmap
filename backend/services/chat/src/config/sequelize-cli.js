const env = require('./env');

const config = {
  url: env.databaseUrl,
  username: env.database.user,
  password: env.database.password,
  database: env.database.name,
  host: env.database.host,
  port: env.database.port,
  dialect: 'postgres'
};

module.exports = {
  development: config,
  test: config,
  production: config
};
