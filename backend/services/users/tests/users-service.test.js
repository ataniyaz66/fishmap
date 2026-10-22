const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const usersRepository = require('../src/repositories/users.repository');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'fishmap-default-dev-jwt-access-secret-32b';

function createTestToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, username: user.username, role: 'user', type: 'access' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

describe('Users Profile Service Tests', () => {
  let server;
  let baseUrl;
  let inMemoryProfiles = [];

  const userA = { id: crypto.randomUUID(), email: 'anglerA@example.com', username: 'angler_a' };
  const userB = { id: crypto.randomUUID(), email: 'anglerB@example.com', username: 'angler_b' };
  const tokenA = createTestToken(userA);
  const tokenB = createTestToken(userB);

  before(async () => {
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
    inMemoryProfiles = [];

    usersRepository.findByAuthUserId = async (authUserId) => {
      return inMemoryProfiles.find((p) => p.authUserId === authUserId) || null;
    };

    usersRepository.findById = async (id) => {
      return inMemoryProfiles.find((p) => p.id === id) || null;
    };

    usersRepository.create = async (data) => {
      const rec = {
        id: crypto.randomUUID(),
        authUserId: data.authUserId,
        displayName: data.displayName || null,
        bio: data.bio || null,
        avatarUrl: data.avatarUrl || null,
        location: data.location || null,
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        createdAt: new Date().toISOString(),
        update: async function(updates) {
          Object.assign(this, updates);
          return this;
        }
      };
      inMemoryProfiles.push(rec);
      return rec;
    };

    usersRepository.update = async (profile, data) => {
      return profile.update(data);
    };

    usersRepository.findPublicProfiles = async (limit = 20, offset = 0) => {
      const publicOnes = inMemoryProfiles.filter((p) => p.isPublic);
      return {
        rows: publicOnes.slice(offset, offset + limit),
        count: publicOnes.length
      };
    };
  });

  test('GET /api/v1/users/me auto-initializes profile on first call', async () => {
    const res = await fetch(`${baseUrl}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.data.id);
    assert.strictEqual(data.data.authUserId, userA.id);
    assert.strictEqual(data.data.isPublic, true);
    assert.strictEqual(inMemoryProfiles.length, 1);
  });

  test('PATCH /api/v1/users/me updates permitted fields', async () => {
    // First init
    await fetch(`${baseUrl}/api/v1/users/me`, { headers: { Authorization: `Bearer ${tokenA}` } });

    const updateRes = await fetch(`${baseUrl}/api/v1/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        displayName: 'Captain Bob',
        bio: 'Passionate bass fisherman from Florida',
        location: 'Orlando, FL',
        avatarUrl: 'https://cdn.fishmap.app/avatars/bob.jpg',
        isPublic: true
      })
    });
    assert.strictEqual(updateRes.status, 200);
    const updated = await updateRes.json();
    assert.strictEqual(updated.data.displayName, 'Captain Bob');
    assert.strictEqual(updated.data.bio, 'Passionate bass fisherman from Florida');
    assert.strictEqual(updated.data.location, 'Orlando, FL');
  });

  test('PATCH /api/v1/users/me rejects invalid input', async () => {
    await fetch(`${baseUrl}/api/v1/users/me`, { headers: { Authorization: `Bearer ${tokenA}` } });

    const res = await fetch(`${baseUrl}/api/v1/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        displayName: 'A'.repeat(101) // Exceeds 100 chars
      })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error.code, 'VALIDATION_ERROR');
  });

  test('GET /api/v1/users/me requires authentication', async () => {
    const res = await fetch(`${baseUrl}/api/v1/users/me`);
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.error.code, 'UNAUTHORIZED');
  });

  test('GET /api/v1/users/:id allows viewing public profile', async () => {
    // Create profile for user A
    const initRes = await fetch(`${baseUrl}/api/v1/users/me`, { headers: { Authorization: `Bearer ${tokenA}` } });
    const { data: profileA } = await initRes.json();

    // User B views User A's profile
    const res = await fetch(`${baseUrl}/api/v1/users/${profileA.id}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.data.id, profileA.id);
  });

  test('GET /api/v1/users/:id hides private profile from other users', async () => {
    // User A initializes and marks private
    await fetch(`${baseUrl}/api/v1/users/me`, { headers: { Authorization: `Bearer ${tokenA}` } });
    const patchRes = await fetch(`${baseUrl}/api/v1/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ isPublic: false })
    });
    const { data: profileA } = await patchRes.json();

    // User B views User A's private profile -> 404
    const res = await fetch(`${baseUrl}/api/v1/users/${profileA.id}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(res.status, 404);

    // User A views own private profile -> 200
    const ownRes = await fetch(`${baseUrl}/api/v1/users/${profileA.id}`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(ownRes.status, 200);
  });

  test('GET /api/v1/users lists public profiles', async () => {
    await fetch(`${baseUrl}/api/v1/users/me`, { headers: { Authorization: `Bearer ${tokenA}` } });
    await fetch(`${baseUrl}/api/v1/users/me`, { headers: { Authorization: `Bearer ${tokenB}` } });

    const res = await fetch(`${baseUrl}/api/v1/users`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.data.length, 2);
    assert.strictEqual(data.total, 2);
  });
});
