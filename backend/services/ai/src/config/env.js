const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: parseInt(process.env.PORT || '4008', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
  aiProvider: process.env.AI_PROVIDER || 'auto',
  jwtSecret: process.env.JWT_ACCESS_SECRET || 'fishmap-default-dev-jwt-access-secret-32b'
};
