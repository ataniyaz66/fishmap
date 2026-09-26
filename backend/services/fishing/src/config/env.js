const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: Number(process.env.PORT) || 4003,
  nodeEnv: process.env.NODE_ENV || 'development',
  fishingDatabaseUrl: process.env.FISHING_DATABASE_URL
};
