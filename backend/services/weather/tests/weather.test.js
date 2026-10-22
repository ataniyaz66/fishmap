const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const weatherService = require('../src/services/weather.service');
const { setWeatherProvider, MockWeatherProvider } = require('../src/providers');

describe('Weather Service Unit & Integration Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    setWeatherProvider(new MockWeatherProvider());
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        baseUrl = `http://127.0.0.1:${server.address().port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  beforeEach(() => {
    weatherService.clearCache();
  });

  test('GET /api/v1/weather/current returns current conditions and fishing suitability', async () => {
    const res = await fetch(`${baseUrl}/api/v1/weather/current?lat=45.123&lng=-93.456`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    const weather = body.data;

    assert.ok(weather.temperatureC !== undefined);
    assert.ok(weather.pressureHpa !== undefined);
    assert.ok(weather.windSpeedKmh !== undefined);
    assert.ok(weather.fishingSuitability !== undefined);
    assert.ok(weather.fishingSuitability.score >= 1 && weather.fishingSuitability.score <= 10);
    assert.ok(['Excellent', 'Good', 'Fair', 'Challenging'].includes(weather.fishingSuitability.rating));
  });

  test('GET /api/v1/weather/forecast returns multi-day forecast', async () => {
    const res = await fetch(`${baseUrl}/api/v1/weather/forecast?lat=45.123&lng=-93.456&days=5`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    const forecast = body.data;

    assert.strictEqual(forecast.days.length, 5);
    assert.ok(forecast.days[0].tempMaxC !== undefined);
    assert.ok(forecast.days[0].date !== undefined);
  });

  test('GET /api/v1/weather/current validates latitude and longitude ranges', async () => {
    // Missing coords
    const missingRes = await fetch(`${baseUrl}/api/v1/weather/current`);
    assert.strictEqual(missingRes.status, 400);

    // Invalid latitude (>90)
    const invalidLatRes = await fetch(`${baseUrl}/api/v1/weather/current?lat=95&lng=0`);
    assert.strictEqual(invalidLatRes.status, 400);

    // Invalid longitude (>180)
    const invalidLngRes = await fetch(`${baseUrl}/api/v1/weather/current?lat=0&lng=200`);
    assert.strictEqual(invalidLngRes.status, 400);
  });

  test('Weather service caches responses for nearby grid coordinates', async () => {
    // First call (45.1234, -93.1234)
    const res1 = await fetch(`${baseUrl}/api/v1/weather/current?lat=45.1234&lng=-93.1234`);
    assert.strictEqual(res1.status, 200);
    const data1 = (await res1.json()).data;

    // Second call within same 0.01 grid (~1.1 km)
    const res2 = await fetch(`${baseUrl}/api/v1/weather/current?lat=45.1239&lng=-93.1239`);
    assert.strictEqual(res2.status, 200);
    const data2 = (await res2.json()).data;

    assert.strictEqual(data1.recordedAt, data2.recordedAt);
  });
});
