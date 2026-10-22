const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

describe('Weather Service Infrastructure & Error Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  test('GET /health returns 200 with service: weather and status: ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.service, 'weather');
    assert.strictEqual(data.status, 'ok');
  });

  test('GET /api/v1/weather/non-existent returns standardized 404 error structure', async () => {
    const res = await fetch(`${baseUrl}/api/v1/weather/non-existent`);
    assert.strictEqual(res.status, 404);
    const data = await res.json();
    assert.ok(data.error, 'Response should contain error object');
    assert.strictEqual(data.error.code, 'NOT_FOUND');
    assert.ok(data.error.message.includes('non-existent'));
    assert.ok(Array.isArray(data.error.details));
  });
});
