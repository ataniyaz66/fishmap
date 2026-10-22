const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const { setAIProvider, RuleBasedAIProvider } = require('../src/providers');

describe('AI Service Unit & Integration Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    setAIProvider(new RuleBasedAIProvider());
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

  test('GET /api/v1/ai/status returns operational capabilities', async () => {
    const res = await fetch(`${baseUrl}/api/v1/ai/status`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.status, 'operational');
    assert.ok(Array.isArray(body.data.capabilities));
  });

  test('POST /api/v1/ai/recommend-lure provides tailored lure advice and matches inventory', async () => {
    const mockInventory = [
      { id: '11111111-1111-1111-1111-111111111111', name: 'Blue Fox Vibrax Spinner', type: 'spinner', color: 'Gold' },
      { id: '22222222-2222-2222-2222-222222222222', name: 'Rapala Deep Tail Dancer', type: 'crankbait', color: 'Silver' }
    ];

    const res = await fetch(`${baseUrl}/api/v1/ai/recommend-lure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        species: 'Trout',
        water_type: 'river',
        depth_meters: 1.5,
        weather: { temperatureC: 16, cloudCoverPercent: 20 },
        user_inventory: mockInventory
      })
    });

    assert.strictEqual(res.status, 200);
    const rec = (await res.json()).data;

    assert.strictEqual(rec.targetSpecies, 'Trout');
    assert.strictEqual(rec.lureType, 'spinner');
    assert.ok(rec.primaryLure.includes('Spinner'));
    assert.ok(rec.confidenceScore > 0.8);
    assert.ok(rec.expertTips.length > 0);

    // Verified inventory matching
    assert.strictEqual(rec.matchingInventory.length, 1);
    assert.strictEqual(rec.matchingInventory[0].name, 'Blue Fox Vibrax Spinner');
  });

  test('POST /api/v1/ai/assist provides structured angling advice', async () => {
    const res = await fetch(`${baseUrl}/api/v1/ai/assist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'What is the best technique for pike in autumn?'
      })
    });

    assert.strictEqual(res.status, 200);
    const assistance = (await res.json()).data;
    assert.ok(assistance.reply.includes('pike'));
    assert.ok(Array.isArray(assistance.suggestedFollowUps));
  });

  test('POST /api/v1/ai/assist validates empty query', async () => {
    const res = await fetch(`${baseUrl}/api/v1/ai/assist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '   ' })
    });
    assert.strictEqual(res.status, 400);
  });
});
