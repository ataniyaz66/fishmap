const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: Number(process.env.PORT) || 4000,
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
  usersServiceUrl: process.env.USERS_SERVICE_URL || 'http://localhost:4002',
  fishingServiceUrl: process.env.FISHING_SERVICE_URL || 'http://localhost:4003',
  inventoryServiceUrl: process.env.INVENTORY_SERVICE_URL || 'http://localhost:4004',
  socialServiceUrl: process.env.SOCIAL_SERVICE_URL || 'http://localhost:4005',
  chatServiceUrl: process.env.CHAT_SERVICE_URL || 'http://localhost:4006',
  weatherServiceUrl: process.env.WEATHER_SERVICE_URL || 'http://localhost:4007',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:4008'
};
