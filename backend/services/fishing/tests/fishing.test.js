const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const spotsRepository = require('../src/repositories/spots.repository');
const catchesRepository = require('../src/repositories/catches.repository');
const sessionsRepository = require('../src/repositories/sessions.repository');
const { Catch, FishingSession, FishingSpot } = require('../src/models');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'fishmap-default-dev-jwt-access-secret-32b';

function createTestToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, username: user.username, role: 'user', type: 'access' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

describe('Fishing Service Unit & Integration Tests', () => {
  let server;
  let baseUrl;

  let inMemorySpots = [];
  let inMemoryCatches = [];
  let inMemorySessions = [];
  let inMemoryFavorites = [];
  let inMemoryReports = [];

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
    inMemorySpots = [];
    inMemoryCatches = [];
    inMemorySessions = [];
    inMemoryFavorites = [];
    inMemoryReports = [];

    // Spots repository mocks
    spotsRepository.create = async (data) => {
      const spot = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemorySpots.push(spot);
      return spot;
    };

    spotsRepository.findById = async (id) => {
      return inMemorySpots.find((s) => s.id === id) || null;
    };

    spotsRepository.findAll = async () => {
      return [...inMemorySpots];
    };

    spotsRepository.findSpots = async (params = {}) => {
      let filtered = [...inMemorySpots];
      if (params.minLat !== undefined) {
        filtered = filtered.filter((s) => s.latitude >= Number(params.minLat));
      }
      if (params.maxLat !== undefined) {
        filtered = filtered.filter((s) => s.latitude <= Number(params.maxLat));
      }
      if (params.minLng !== undefined) {
        filtered = filtered.filter((s) => s.longitude >= Number(params.minLng));
      }
      if (params.maxLng !== undefined) {
        filtered = filtered.filter((s) => s.longitude <= Number(params.maxLng));
      }
      return { count: filtered.length, rows: filtered };
    };

    spotsRepository.findUserFavorites = async (userId) => {
      const favSpotIds = inMemoryFavorites.filter((f) => f.userId === userId).map((f) => f.spotId);
      return favSpotIds.map((id) => {
        const spot = inMemorySpots.find((s) => s.id === id);
        return { spot };
      });
    };

    spotsRepository.update = async (spot, updates) => {
      Object.assign(spot, updates, { updatedAt: new Date() });
      return spot;
    };

    spotsRepository.remove = async (spot) => {
      const idx = inMemorySpots.findIndex((s) => s.id === spot.id);
      if (idx !== -1) inMemorySpots.splice(idx, 1);
    };

    spotsRepository.addFavorite = async (userId, spotId) => {
      const existing = inMemoryFavorites.find((f) => f.userId === userId && f.spotId === spotId);
      if (!existing) inMemoryFavorites.push({ id: crypto.randomUUID(), userId, spotId });
      return { favorited: true };
    };

    spotsRepository.removeFavorite = async (userId, spotId) => {
      inMemoryFavorites = inMemoryFavorites.filter((f) => !(f.userId === userId && f.spotId === spotId));
      return { favorited: false };
    };

    spotsRepository.listFavorites = async (userId) => {
      const favSpotIds = inMemoryFavorites.filter((f) => f.userId === userId).map((f) => f.spotId);
      return inMemorySpots.filter((s) => favSpotIds.includes(s.id));
    };

    spotsRepository.createReport = async (data) => {
      const report = { id: crypto.randomUUID(), ...data, createdAt: new Date() };
      inMemoryReports.push(report);
      return report;
    };

    // Sessions repository mocks
    sessionsRepository.create = async (data) => {
      const session = { id: crypto.randomUUID(), ...data, catches: [], createdAt: new Date() };
      inMemorySessions.push(session);
      return session;
    };

    sessionsRepository.findById = async (id) => {
      return inMemorySessions.find((s) => s.id === id) || null;
    };

    sessionsRepository.findByUserId = async (userId) => {
      return inMemorySessions.filter((s) => s.userId === userId);
    };

    sessionsRepository.update = async (session, updates) => {
      Object.assign(session, updates, { updatedAt: new Date() });
      return session;
    };

    sessionsRepository.remove = async (session) => {
      const idx = inMemorySessions.findIndex((s) => s.id === session.id);
      if (idx !== -1) inMemorySessions.splice(idx, 1);
    };

    // Catches repository mocks
    catchesRepository.create = async (data) => {
      const catchRecord = { id: crypto.randomUUID(), ...data, createdAt: new Date() };
      inMemoryCatches.push(catchRecord);
      return catchRecord;
    };

    catchesRepository.findById = async (id) => {
      return inMemoryCatches.find((c) => c.id === id) || null;
    };

    catchesRepository.findBySpotId = async (spotId) => {
      return inMemoryCatches.filter((c) => c.spotId === spotId);
    };

    catchesRepository.findAndCountAll = async () => {
      return { count: inMemoryCatches.length, rows: [...inMemoryCatches] };
    };

    catchesRepository.update = async (catchRecord, updates) => {
      Object.assign(catchRecord, updates, { updatedAt: new Date() });
      return catchRecord;
    };

    catchesRepository.remove = async (catchRecord) => {
      const idx = inMemoryCatches.findIndex((c) => c.id === catchRecord.id);
      if (idx !== -1) inMemoryCatches.splice(idx, 1);
    };

    // Analytics model mocks
    Catch.findAll = async ({ where }) => {
      const list = inMemoryCatches.filter((c) => !where || !where.userId || c.userId === where.userId);
      return list.map((c) => {
        const spot = inMemorySpots.find((s) => s.id === c.spotId);
        return { ...c, spot };
      });
    };

    FishingSession.findAll = async ({ where }) => {
      return inMemorySessions.filter((s) => !where || !where.userId || s.userId === where.userId);
    };
  });

  // SPOT TESTS
  test('POST /api/v1/fishing/spots creates a public spot with valid token', async () => {
    const res = await fetch(`${baseUrl}/api/v1/fishing/spots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        name: 'Lake Pine Point',
        latitude: 45.1234,
        longitude: -93.1234,
        water_type: 'lake',
        visibility: 'public'
      })
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.data.name, 'Lake Pine Point');
    assert.strictEqual(body.data.userId, userA.id);
    assert.strictEqual(body.data.visibility, 'public');
  });

  test('POST /api/v1/fishing/spots rejects unauthenticated requests', async () => {
    const res = await fetch(`${baseUrl}/api/v1/fishing/spots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Secret Spot', latitude: 45.0, longitude: -93.0 })
    });
    assert.strictEqual(res.status, 401);
  });

  test('GET /api/v1/fishing/spots filters by radius correctly', async () => {
    // Spot A: center (45.0, -93.0)
    await spotsRepository.create({
      userId: userA.id,
      name: 'Spot Center',
      latitude: 45.0,
      longitude: -93.0,
      visibility: 'public'
    });
    // Spot B: ~1 km away (45.008, -93.0)
    await spotsRepository.create({
      userId: userA.id,
      name: 'Spot Nearby',
      latitude: 45.008,
      longitude: -93.0,
      visibility: 'public'
    });
    // Spot C: ~150 km away (46.3, -93.0)
    await spotsRepository.create({
      userId: userA.id,
      name: 'Spot Distant',
      latitude: 46.3,
      longitude: -93.0,
      visibility: 'public'
    });

    const res = await fetch(`${baseUrl}/api/v1/fishing/spots?latitude=45.0&longitude=-93.0&radius=10`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.total, 2);
    const names = body.data.map((s) => s.name);
    assert.ok(names.includes('Spot Center'));
    assert.ok(names.includes('Spot Nearby'));
    assert.ok(!names.includes('Spot Distant'));
  });

  test('POST and DELETE /api/v1/fishing/spots/:id/favorite manages favorites', async () => {
    const spot = await spotsRepository.create({
      userId: userA.id,
      name: 'Pike Haven',
      latitude: 45.0,
      longitude: -93.0,
      visibility: 'public'
    });

    // Favorite spot
    const favRes = await fetch(`${baseUrl}/api/v1/fishing/spots/${spot.id}/favorite`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(favRes.status, 200);

    // List favorites
    const listRes = await fetch(`${baseUrl}/api/v1/fishing/spots/favorites`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(listRes.status, 200);
    const favs = await listRes.json();
    assert.strictEqual(favs.data.length, 1);
    assert.strictEqual(favs.data[0].id, spot.id);

    // Unfavorite spot
    const unfavRes = await fetch(`${baseUrl}/api/v1/fishing/spots/${spot.id}/favorite`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(unfavRes.status, 200);
  });

  test('POST /api/v1/fishing/spots/:id/report submits user report', async () => {
    const spot = await spotsRepository.create({
      userId: userA.id,
      name: 'Reported Spot',
      latitude: 45.0,
      longitude: -93.0,
      visibility: 'public'
    });

    const res = await fetch(`${baseUrl}/api/v1/fishing/spots/${spot.id}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`
      },
      body: JSON.stringify({ reason: 'Trespassing / private property', description: 'Gated entrance' })
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(inMemoryReports.length, 1);
  });

  // SESSIONS TESTS
  test('Fishing sessions CRUD operations work as expected', async () => {
    // 1. Create session
    const createRes = await fetch(`${baseUrl}/api/v1/fishing/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Morning Bass Run',
        started_at: new Date().toISOString(),
        notes: 'Clear waters and sunny'
      })
    });
    assert.strictEqual(createRes.status, 201);
    const session = (await createRes.json()).data;
    assert.strictEqual(session.title, 'Morning Bass Run');

    // 2. List sessions
    const listRes = await fetch(`${baseUrl}/api/v1/fishing/sessions`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(listRes.status, 200);
    const list = await listRes.json();
    assert.strictEqual(list.data.length, 1);

    // 3. User B cannot access User A session
    const forbiddenRes = await fetch(`${baseUrl}/api/v1/fishing/sessions/${session.id}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(forbiddenRes.status, 403);

    // 4. Update session
    const updateRes = await fetch(`${baseUrl}/api/v1/fishing/sessions/${session.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ notes: 'Ended early due to rain' })
    });
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual((await updateRes.json()).data.notes, 'Ended early due to rain');

    // 5. Delete session
    const delRes = await fetch(`${baseUrl}/api/v1/fishing/sessions/${session.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(delRes.status, 204);
  });

  // CATCHES & ANALYTICS TESTS
  test('Catches recording and user analytics compute correctly', async () => {
    const spot = await spotsRepository.create({
      userId: userA.id,
      name: 'Crystal River',
      latitude: 45.0,
      longitude: -93.0,
      visibility: 'public'
    });

    // Record catch 1
    const c1Res = await fetch(`${baseUrl}/api/v1/fishing/catches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        spot_id: spot.id,
        species: 'Largemouth Bass',
        weight: 2.5,
        length: 45.0,
        bait: 'Senko Worm',
        caught_at: new Date().toISOString()
      })
    });
    assert.strictEqual(c1Res.status, 201);

    // Record catch 2
    const c2Res = await fetch(`${baseUrl}/api/v1/fishing/catches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        spot_id: spot.id,
        species: 'Northern Pike',
        weight: 5.2,
        length: 75.0,
        bait: 'Spoon Lure',
        caught_at: new Date().toISOString()
      })
    });
    assert.strictEqual(c2Res.status, 201);

    // Get Analytics
    const analyticsRes = await fetch(`${baseUrl}/api/v1/fishing/analytics/user`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(analyticsRes.status, 200);
    const analytics = (await analyticsRes.json()).data;

    assert.strictEqual(analytics.overview.totalCatches, 2);
    assert.strictEqual(analytics.overview.uniqueSpecies, 2);
    assert.strictEqual(analytics.overview.maxWeight, 5.2);
    assert.strictEqual(analytics.overview.maxLength, 75.0);
    assert.strictEqual(analytics.topBaits.length, 2);
    assert.strictEqual(analytics.topSpots[0].spotName, 'Crystal River');
  });
});
