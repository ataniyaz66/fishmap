const dotenv = require('dotenv');

dotenv.config();

const validNodeEnvironments = new Set(['development', 'test', 'production']);
const port = Number(process.env.PORT);
const nodeEnv = process.env.NODE_ENV;
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

module.exports = Object.freeze({
  port,
  nodeEnv,
  authDatabaseUrl,
});
