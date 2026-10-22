const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const validNodeEnvironments = new Set(['development', 'test', 'production']);
const port = Number(process.env.PORT) || 4001;
const nodeEnv = process.env.NODE_ENV || 'development';
const authDatabaseUrl = process.env.AUTH_DATABASE_URL;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Invalid environment configuration: PORT must be an integer between 1 and 65535.');
}

if (!validNodeEnvironments.has(nodeEnv)) {
  throw new Error('Invalid environment configuration: NODE_ENV must be development, test, or production.');
}

if (!authDatabaseUrl) {
  throw new Error('Invalid environment configuration: AUTH_DATABASE_URL is required.');
}

try {
  const databaseUrl = new URL(authDatabaseUrl);

  if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol)) {
    throw new Error('AUTH_DATABASE_URL must use the postgres or postgresql protocol.');
  }
} catch (error) {
  throw new Error(`Invalid environment configuration: ${error.message}`);
}

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET || (nodeEnv === 'production' ? null : 'fishmap-default-dev-jwt-access-secret-32b');
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || (nodeEnv === 'production' ? null : 'fishmap-default-dev-jwt-refresh-secret-32b');
const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

if (nodeEnv === 'production' && (!jwtAccessSecret || !jwtRefreshSecret)) {
  throw new Error('Invalid environment configuration: JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be configured in production.');
}

module.exports = Object.freeze({
  port,
  nodeEnv,
  authDatabaseUrl,
  jwtAccessSecret,
  jwtRefreshSecret,
  jwtAccessExpiresIn,
  jwtRefreshExpiresIn,
});
