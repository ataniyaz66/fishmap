const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredVariables = [
  'AUTH_SERVICE_URL',
  'USERS_SERVICE_URL',
  'FISHING_SERVICE_URL',
  'INVENTORY_SERVICE_URL'
];
const missingVariables = requiredVariables.filter(
  (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing environment variables: ${missingVariables.join(', ')}`
  );
}

module.exports = {
  port: Number(process.env.PORT) || 4000,
  authServiceUrl: process.env.AUTH_SERVICE_URL,
  usersServiceUrl: process.env.USERS_SERVICE_URL,
  fishingServiceUrl: process.env.FISHING_SERVICE_URL,
  inventoryServiceUrl: process.env.INVENTORY_SERVICE_URL
};
