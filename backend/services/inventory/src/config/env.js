const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: Number(process.env.PORT) || 4004,
  nodeEnv: process.env.NODE_ENV || 'development',
  inventoryDatabaseUrl: process.env.INVENTORY_DATABASE_URL
};
