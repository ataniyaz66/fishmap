const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let host = process.env.DB_HOST || 'localhost';
let port = parseInt(process.env.DB_PORT || '5434', 10);
let name = process.env.DB_NAME || 'fishmap_social';
let user = process.env.DB_USER || 'postgres';
let password = process.env.DB_PASSWORD || 'postgres';

const rawUrl = process.env.SOCIAL_DATABASE_URL || process.env.DATABASE_URL;
if (rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    host = parsed.hostname || host;
    port = parseInt(parsed.port || '5432', 10);
    name = parsed.pathname ? parsed.pathname.replace(/^\//, '') : name;
    user = parsed.username || user;
    password = parsed.password || password;
  } catch (_) {}
}

module.exports = {
  port: parseInt(process.env.PORT || '4005', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_ACCESS_SECRET || 'fishmap-default-dev-jwt-access-secret-32b',
  databaseUrl: rawUrl || `postgresql://${user}:${password}@${host}:${port}/${name}`,
  database: {
    host,
    port,
    name,
    user,
    password
  }
};
