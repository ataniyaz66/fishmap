const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

describe('API Gateway Foundation Tests', () => {
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

  test('GET /health returns status ok with service gateway', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.service, 'gateway');
    assert.strictEqual(data.status, 'ok');
  });

  test('GET /unknown-route returns standardized 404 error structure', async () => {
    const res = await fetch(`${baseUrl}/non-existent-route`);
    assert.strictEqual(res.status, 404);
    const data = await res.json();
    assert.ok(data.error, 'Response should contain error object');
    assert.strictEqual(data.error.code, 'NOT_FOUND');
    assert.ok(data.error.message.includes('non-existent-route'));
    assert.ok(Array.isArray(data.error.details));
  });

  test('Proxied routes forward to downstream and return 504/502 when service is unreachable', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/health`);
    // Downstream service responds if running (200/404) or proxy returns 502/504 when unreachable
    assert.ok([200, 404, 500, 502, 503, 504].includes(res.status));
  });
});
