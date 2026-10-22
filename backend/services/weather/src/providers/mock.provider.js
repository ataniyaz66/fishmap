class MockWeatherProvider {
  async getCurrentWeather(latitude, longitude) {
    const lat = Number(latitude);
    const lng = Number(longitude);

    // Deterministic pseudo-weather based on coords
    const temp = Math.round((18 + Math.sin(lat) * 8) * 10) / 10;
    const pressure = Math.round(1013 + Math.cos(lng) * 10);
    const windSpeed = Math.round(12 + Math.abs(Math.sin(lat + lng)) * 10);
    const windDir = Math.round((Math.abs(lat * 10) % 360));
    const humidity = Math.round(65 + Math.cos(lat) * 15);
    const cloudCover = Math.round(30 + Math.sin(lng) * 30);

    return {
      source: 'mock',
      latitude: lat,
      longitude: lng,
      temperatureC: temp,
      temperatureF: Math.round((temp * 9 / 5 + 32) * 10) / 10,
      pressureHpa: pressure,
      humidityPercent: humidity,
      windSpeedKmh: windSpeed,
      windDirectionDeg: windDir,
      cloudCoverPercent: cloudCover,
      conditions: cloudCover > 70 ? 'Overcast' : cloudCover > 30 ? 'Partly Cloudy' : 'Clear',
      recordedAt: new Date().toISOString()
    };
  }

  async getForecast(latitude, longitude, days = 3) {
    const lat = Number(latitude);
    const lng = Number(longitude);
    const forecastDays = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const tempMax = Math.round((22 + Math.sin(lat + i) * 6) * 10) / 10;
      const tempMin = Math.round((14 + Math.sin(lat + i) * 4) * 10) / 10;
      const pressure = Math.round(1013 + Math.cos(lng + i) * 8);
      const windSpeed = Math.round(10 + (i * 2));
      const rainProb = Math.round(Math.abs(Math.sin(i)) * 40);

      forecastDays.push({
        date: dateStr,
        tempMaxC: tempMax,
        tempMinC: tempMin,
        pressureHpa: pressure,
        windSpeedKmh: windSpeed,
        precipitationProbabilityPercent: rainProb,
        conditions: rainProb > 50 ? 'Rain' : rainProb > 25 ? 'Scattered Showers' : 'Partly Cloudy'
      });
    }

    return {
      source: 'mock',
      latitude: lat,
      longitude: lng,
      days: forecastDays
    };
  }
}

module.exports = MockWeatherProvider;
