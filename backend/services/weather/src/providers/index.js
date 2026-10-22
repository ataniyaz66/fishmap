const OpenMeteoProvider = require('./open-meteo.provider');
const MockWeatherProvider = require('./mock.provider');
const env = require('../config/env');

let activeProvider = null;

function getWeatherProvider() {
  if (!activeProvider) {
    if (env.weatherProvider === 'mock' || env.nodeEnv === 'test') {
      activeProvider = new MockWeatherProvider();
    } else {
      activeProvider = new OpenMeteoProvider();
    }
  }
  return activeProvider;
}

function setWeatherProvider(provider) {
  activeProvider = provider;
}

module.exports = {
  getWeatherProvider,
  setWeatherProvider,
  OpenMeteoProvider,
  MockWeatherProvider
};
