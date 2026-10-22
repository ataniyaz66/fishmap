const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const AppError = require('../src/utils/app-error');

describe('Auth Service Infrastructure & Error Tests', () => {
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

  test('GET /health returns 200 with service: auth and status: ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.service, 'auth');
    assert.strictEqual(data.status, 'ok');
  });

  test('GET /api/v1/auth/non-existent returns standardized 404 error structure', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/non-existent`);
    assert.strictEqual(res.status, 404);
    const data = await res.json();
    assert.ok(data.error, 'Response should contain error object');
    assert.strictEqual(data.error.code, 'NOT_FOUND');
    assert.ok(data.error.message.includes('non-existent'));
    assert.ok(Array.isArray(data.error.details));
  });

  test('POST /api/v1/auth/register with malformed JSON returns 400 INVALID_JSON', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"invalid": json'
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error.code, 'INVALID_JSON');
  });

  test('AppError creates formatted error instance with details', () => {
    const error = new AppError('Field missing', 400, 'VALIDATION_ERROR', [{ field: 'email', message: 'Required' }]);
    assert.strictEqual(error.message, 'Field missing');
    assert.strictEqual(error.statusCode, 400);
    assert.strictEqual(error.code, 'VALIDATION_ERROR');
    assert.strictEqual(error.details.length, 1);
    assert.strictEqual(error.details[0].field, 'email');
  });
});
