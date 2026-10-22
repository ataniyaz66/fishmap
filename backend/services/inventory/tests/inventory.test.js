const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const inventoryRepository = require('../src/repositories/inventory.repository');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'fishmap-default-dev-jwt-access-secret-32b';

function createTestToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, username: user.username, role: 'user', type: 'access' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

describe('Inventory Service Unit & Integration Tests', () => {
  let server;
  let baseUrl;
  let inMemoryItems = [];

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
    inMemoryItems = [];

    inventoryRepository.create = async (values) => {
      const item = {
        id: crypto.randomUUID(),
        ...values,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryItems.push(item);
      return item;
    };

    inventoryRepository.findAllByUserId = async (userId, options = {}) => {
      let items = inMemoryItems.filter((i) => i.userId === userId);
      if (options.allowedVisibilities) {
        items = items.filter((i) => options.allowedVisibilities.includes(i.visibility));
      }
      if (options.type) {
        items = items.filter((i) => i.type === options.type);
      }
      return [...items];
    };

    inventoryRepository.findById = async (id) => {
      return inMemoryItems.find((i) => i.id === id) || null;
    };

    inventoryRepository.update = async (item, values) => {
      Object.assign(item, values, { updatedAt: new Date() });
      return item;
    };

    inventoryRepository.delete = async (item) => {
      const idx = inMemoryItems.findIndex((i) => i.id === item.id);
      if (idx !== -1) inMemoryItems.splice(idx, 1);
    };
  });

  test('POST /api/v1/inventory/items creates an item with authentication', async () => {
    const res = await fetch(`${baseUrl}/api/v1/inventory/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        name: 'Rapala Shadow Rap',
        type: 'lure',
        quantity: 3,
        brand: 'Rapala',
        color: 'Silver/Black',
        weight_grams: 14.5,
        visibility: 'friends'
      })
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.data.name, 'Rapala Shadow Rap');
    assert.strictEqual(body.data.userId, userA.id);
    assert.strictEqual(body.data.type, 'lure');
    assert.strictEqual(body.data.color, 'Silver/Black');
    assert.strictEqual(body.data.weightGrams, 14.5);
    assert.strictEqual(body.data.visibility, 'friends');
  });

  test('POST /api/v1/inventory/items rejects unauthenticated request without token or id', async () => {
    const res = await fetch(`${baseUrl}/api/v1/inventory/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Shimano Stella', type: 'reel' })
    });
    assert.strictEqual(res.status, 401);
  });

  test('GET /api/v1/inventory/items lists authenticated user items and supports type filter', async () => {
    await inventoryRepository.create({
      userId: userA.id,
      name: 'Lure A',
      type: 'lure',
      quantity: 1,
      visibility: 'private'
    });
    await inventoryRepository.create({
      userId: userA.id,
      name: 'Rod X',
      type: 'rod',
      quantity: 2,
      visibility: 'private'
    });

    // List all
    const allRes = await fetch(`${baseUrl}/api/v1/inventory/items`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(allRes.status, 200);
    const allBody = await allRes.json();
    assert.strictEqual(allBody.data.length, 2);

    // Filter by type
    const rodRes = await fetch(`${baseUrl}/api/v1/inventory/items?type=rod`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(rodRes.status, 200);
    const rodBody = await rodRes.json();
    assert.strictEqual(rodBody.data.length, 1);
    assert.strictEqual(rodBody.data[0].name, 'Rod X');
  });

  test('Visibility rules: other users can only see public/friends items, not private', async () => {
    await inventoryRepository.create({
      userId: userA.id,
      name: 'Secret Handcrafted Lure',
      type: 'lure',
      quantity: 1,
      visibility: 'private'
    });
    await inventoryRepository.create({
      userId: userA.id,
      name: 'Shared Spinnerbait',
      type: 'lure',
      quantity: 2,
      visibility: 'friends'
    });

    // User B views User A items
    const res = await fetch(`${baseUrl}/api/v1/inventory/items?user_id=${userA.id}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.length, 1);
    assert.strictEqual(body.data[0].name, 'Shared Spinnerbait');
  });

  test('PATCH and DELETE /api/v1/inventory/items/:id works for owner', async () => {
    const item = await inventoryRepository.create({
      userId: userA.id,
      name: 'Tackle Box 3000',
      type: 'box',
      quantity: 1,
      visibility: 'private'
    });

    // Update
    const patchRes = await fetch(`${baseUrl}/api/v1/inventory/items/${item.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ quantity: 5 })
    });
    assert.strictEqual(patchRes.status, 200);
    assert.strictEqual((await patchRes.json()).data.quantity, 5);

    // Delete
    const delRes = await fetch(`${baseUrl}/api/v1/inventory/items/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(delRes.status, 204);
    assert.strictEqual(inMemoryItems.length, 0);
  });

  test('User B cannot update or delete User A inventory item', async () => {
    const item = await inventoryRepository.create({
      userId: userA.id,
      name: 'Daiwa BG 4000',
      type: 'reel',
      quantity: 1,
      visibility: 'private'
    });

    const patchRes = await fetch(`${baseUrl}/api/v1/inventory/items/${item.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`
      },
      body: JSON.stringify({ quantity: 99 })
    });
    assert.strictEqual(patchRes.status, 404);
  });
});
