const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: parseInt(process.env.PORT || '4007', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  weatherProvider: process.env.WEATHER_PROVIDER || 'open-meteo',
  cacheTtlMinutes: parseInt(process.env.WEATHER_CACHE_TTL_MINUTES || '30', 10)
};
