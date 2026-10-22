const { getWeatherProvider } = require('../providers');
const AppError = require('../utils/app-error');
const env = require('../config/env');

const cache = new Map();
const CACHE_TTL_MS = (env.cacheTtlMinutes || 30) * 60 * 1000;

function validateCoordinates(lat, lng) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new AppError('latitude must be a valid number between -90 and 90', 400);
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new AppError('longitude must be a valid number between -180 and 180', 400);
  }

  return { latitude, longitude };
}

function getGridKey(lat, lng, type) {
  const roundedLat = Math.round(lat * 100) / 100;
  const roundedLng = Math.round(lng * 100) / 100;
  return `${type}:${roundedLat}:${roundedLng}`;
}

function calculateFishingSuitability(weather) {
  let score = 7; // baseline
  const factors = [];

  // 1. Barometric Pressure
  const pressure = weather.pressureHpa;
  if (pressure >= 1010 && pressure <= 1018) {
    score += 1.5;
    factors.push('Barometric pressure is stable (optimal feeding activity)');
  } else if (pressure < 1005) {
    score -= 2.0;
    factors.push('Low pressure front: fish may seek deeper shelter');
  } else if (pressure > 1024) {
    score -= 1.0;
    factors.push('High pressure: slow bite, downsize lures');
  }

  // 2. Wind
  const wind = weather.windSpeedKmh;
  if (wind >= 5 && wind <= 15) {
    score += 1.0;
    factors.push('Light chop on the water masks boat and line shadows');
  } else if (wind > 25) {
    score -= 2.0;
    factors.push('High wind speeds make boat control and casting challenging');
  } else if (wind < 3) {
    factors.push('Glassy water requires stealthy presentations');
  }

  // 3. Cloud Cover
  const clouds = weather.cloudCoverPercent;
  if (clouds >= 40 && clouds <= 80) {
    score += 0.5;
    factors.push('Overcast skies encourage fish to roam out of heavy cover');
  }

  // Clamp score between 1 and 10
  const finalScore = Math.min(Math.max(Math.round(score * 10) / 10, 1.0), 10.0);

  let rating = 'Fair';
  if (finalScore >= 8.5) rating = 'Excellent';
  else if (finalScore >= 7.0) rating = 'Good';
  else if (finalScore < 5.0) rating = 'Challenging';

  return {
    score: finalScore,
    rating,
    recommendations: factors
  };
}

async function getCurrentWeather(lat, lng) {
  const { latitude, longitude } = validateCoordinates(lat, lng);
  const key = getGridKey(latitude, longitude, 'current');

  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const provider = getWeatherProvider();
  const rawWeather = await provider.getCurrentWeather(latitude, longitude);
  const suitability = calculateFishingSuitability(rawWeather);

  const result = {
    ...rawWeather,
    fishingSuitability: suitability
  };

  cache.set(key, { timestamp: Date.now(), data: result });
  return result;
}

async function getForecast(lat, lng, days = 3) {
  const { latitude, longitude } = validateCoordinates(lat, lng);
  const dayCount = Math.min(Math.max(Number(days) || 3, 1), 7);
  const key = `${getGridKey(latitude, longitude, 'forecast')}:${dayCount}`;

  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const provider = getWeatherProvider();
  const result = await provider.getForecast(latitude, longitude, dayCount);

  cache.set(key, { timestamp: Date.now(), data: result });
  return result;
}

function clearCache() {
  cache.clear();
}

module.exports = {
  getCurrentWeather,
  getForecast,
  calculateFishingSuitability,
  clearCache
};
