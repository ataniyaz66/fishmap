const MockWeatherProvider = require('./mock.provider');

class OpenMeteoProvider {
  constructor() {
    this.fallback = new MockWeatherProvider();
  }

  async getCurrentWeather(latitude, longitude) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,cloud_cover,weather_code&timezone=auto`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`OpenMeteo returned status ${res.status}`);
      }

      const data = await res.json();
      const curr = data.current;

      const tempC = curr.temperature_2m;
      const pressure = curr.surface_pressure;
      const windSpeed = curr.wind_speed_10m;
      const windDir = curr.wind_direction_10m;
      const humidity = curr.relative_humidity_2m;
      const cloudCover = curr.cloud_cover;

      return {
        source: 'open-meteo',
        latitude: Number(latitude),
        longitude: Number(longitude),
        temperatureC: tempC,
        temperatureF: Math.round((tempC * 9 / 5 + 32) * 10) / 10,
        pressureHpa: Math.round(pressure * 10) / 10,
        humidityPercent: humidity,
        windSpeedKmh: Math.round(windSpeed * 10) / 10,
        windDirectionDeg: windDir,
        cloudCoverPercent: cloudCover,
        conditions: cloudCover > 70 ? 'Overcast' : cloudCover > 30 ? 'Partly Cloudy' : 'Clear',
        recordedAt: curr.time || new Date().toISOString()
      };
    } catch (err) {
      // Graceful fallback to mock provider when offline or during test suite
      return this.fallback.getCurrentWeather(latitude, longitude);
    }
  }

  async getForecast(latitude, longitude, days = 3) {
    try {
      const clampedDays = Math.min(Math.max(Number(days) || 3, 1), 7);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&forecast_days=${clampedDays}&timezone=auto`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`OpenMeteo returned status ${res.status}`);
      }

      const data = await res.json();
      const daily = data.daily;

      const forecastDays = daily.time.map((dateStr, idx) => ({
        date: dateStr,
        tempMaxC: daily.temperature_2m_max[idx],
        tempMinC: daily.temperature_2m_min[idx],
        pressureHpa: 1013,
        windSpeedKmh: daily.wind_speed_10m_max[idx],
        precipitationProbabilityPercent: daily.precipitation_probability_max[idx] || 0,
        conditions: (daily.precipitation_probability_max[idx] || 0) > 40 ? 'Rain Expected' : 'Partly Cloudy'
      }));

      return {
        source: 'open-meteo',
        latitude: Number(latitude),
        longitude: Number(longitude),
        days: forecastDays
      };
    } catch (err) {
      return this.fallback.getForecast(latitude, longitude, days);
    }
  }
}

module.exports = OpenMeteoProvider;
