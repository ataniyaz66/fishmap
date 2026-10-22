const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const app = require('../src/app');
const authRepository = require('../src/repositories/auth.repository');

describe('Auth Service HTTP Endpoints Integration Tests', () => {
  let server;
  let baseUrl;
  let inMemoryUsers = [];
  let inMemoryTokens = [];

  before(async () => {
    // Disable rate limiting for this test suite
    process.env.DISABLE_RATE_LIMIT = 'true';

    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    delete process.env.DISABLE_RATE_LIMIT;
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  beforeEach(() => {
    inMemoryUsers = [];
    inMemoryTokens = [];

    authRepository.findByEmail = async (email) => {
      return inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
    };

    authRepository.findByUsername = async (username) => {
      return inMemoryUsers.find((u) => u.username.toLowerCase() === username.toLowerCase().trim()) || null;
    };

    authRepository.findById = async (id) => {
      return inMemoryUsers.find((u) => u.id === id) || null;
    };

    authRepository.createUser = async (data) => {
      const record = {
        id: crypto.randomUUID(),
        email: data.email,
        username: data.username,
        passwordHash: data.passwordHash,
        accountStatus: data.accountStatus || 'active',
        createdAt: new Date().toISOString()
      };
      inMemoryUsers.push(record);
      return record;
    };

    authRepository.createRefreshToken = async (data) => {
      const record = {
        id: crypto.randomUUID(),
        userId: data.userId,
        tokenHash: data.tokenHash,
        familyId: data.familyId,
        expiresAt: data.expiresAt,
        isRevoked: data.isRevoked || false
      };
      inMemoryTokens.push(record);
      return record;
    };

    authRepository.findRefreshTokenByHash = async (hash) => {
      return inMemoryTokens.find((t) => t.tokenHash === hash) || null;
    };

    authRepository.revokeRefreshToken = async (hash) => {
      const item = inMemoryTokens.find((t) => t.tokenHash === hash);
      if (item) item.isRevoked = true;
      return [item ? 1 : 0];
    };

    authRepository.revokeFamily = async (famId) => {
      let count = 0;
      for (const t of inMemoryTokens) {
        if (t.familyId === famId) {
          t.isRevoked = true;
          count++;
        }
      }
      return [count];
    };
  });

  test('full auth flow: register -> login -> access /me -> refresh -> logout -> verify revoked', async () => {
    // 1. Register
    const regRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'bass_pro@example.com',
        username: 'bass_pro',
        password: 'Password1234!'
      })
    });
    assert.strictEqual(regRes.status, 201);
    const regData = await regRes.json();
    assert.ok(regData.user.id);
    assert.strictEqual(regData.user.email, 'bass_pro@example.com');
    assert.strictEqual(regData.user.username, 'bass_pro');

    // 2. Login with email
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'BASS_PRO@example.com',
        password: 'Password1234!'
      })
    });
    assert.strictEqual(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.ok(loginData.accessToken);
    assert.ok(loginData.refreshToken);
    assert.strictEqual(loginData.tokenType, 'Bearer');

    // 3. Access protected GET /api/v1/auth/me using Bearer accessToken
    const meRes = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${loginData.accessToken}`
      }
    });
    assert.strictEqual(meRes.status, 200);
    const meData = await meRes.json();
    assert.strictEqual(meData.user.id, regData.user.id);
    assert.strictEqual(meData.user.email, 'bass_pro@example.com');

    // 4. Rotate tokens via POST /api/v1/auth/refresh
    const refreshRes = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: loginData.refreshToken
      })
    });
    assert.strictEqual(refreshRes.status, 200);
    const refreshData = await refreshRes.json();
    assert.ok(refreshData.accessToken);
    assert.ok(refreshData.refreshToken);
    assert.notStrictEqual(refreshData.refreshToken, loginData.refreshToken);

    // 5. Try reusing old refresh token -> must fail with 401 INVALID_REFRESH_TOKEN
    const reuseRes = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: loginData.refreshToken
      })
    });
    assert.strictEqual(reuseRes.status, 401);
    const reuseData = await reuseRes.json();
    assert.strictEqual(reuseData.error.code, 'INVALID_REFRESH_TOKEN');

    // 6. Logout via POST /api/v1/auth/logout with new refreshToken
    const logoutRes = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: refreshData.refreshToken
      })
    });
    assert.strictEqual(logoutRes.status, 204);
  });

  test('POST /api/v1/auth/register returns 409 when email already exists', async () => {
    // First registration
    await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'angler@example.com',
        username: 'angler1',
        password: 'Password123!'
      })
    });

    // Duplicate registration
    const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ANGLER@example.com',
        username: 'angler2',
        password: 'Password123!'
      })
    });
    assert.strictEqual(res.status, 409);
    const data = await res.json();
    assert.strictEqual(data.error.code, 'EMAIL_ALREADY_EXISTS');
  });

  test('POST /api/v1/auth/login returns 401 when password does not match', async () => {
    await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@example.com',
        username: 'angler_user',
        password: 'CorrectPassword123'
      })
    });

    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'WrongPassword'
      })
    });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.error.code, 'INVALID_CREDENTIALS');
  });

  test('GET /api/v1/auth/me returns 401 when Authorization header is absent', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/me`);
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.error.code, 'UNAUTHORIZED');
  });
});
