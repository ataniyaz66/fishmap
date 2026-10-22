const http = require('http');
const assert = require('assert/strict');

// Import all service Express apps
const authApp = require('../backend/services/auth/src/app');
const usersApp = require('../backend/services/users/src/app');
const fishingApp = require('../backend/services/fishing/src/app');
const inventoryApp = require('../backend/services/inventory/src/app');
const socialApp = require('../backend/services/social/src/app');
const chatApp = require('../backend/services/chat/src/app');
const weatherApp = require('../backend/services/weather/src/app');
const aiApp = require('../backend/services/ai/src/app');
const gatewayApp = require('../backend/gateway/src/app');

// Also import database connection functions for graceful cleanup
const { sequelize: authDb } = require('../backend/services/auth/src/database/connection');
const usersDb = require('../backend/services/users/src/config/database');
const fishingDb = require('../backend/services/fishing/src/config/database');
const inventoryDb = require('../backend/services/inventory/src/config/database');
const socialDb = require('../backend/services/social/src/config/database');
const chatDb = require('../backend/services/chat/src/config/database');

async function startServer(app, port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, '127.0.0.1', () => {
      resolve(server);
    });
    server.on('error', reject);
  });
}

async function runAudit() {
  console.log('===============================================================');
  console.log('   FISHMAP FULL RUNTIME & END-TO-END INTEGRATION AUDIT');
  console.log('===============================================================\n');

  const servers = [];
  const ports = [
    { name: 'Auth Service', app: authApp, port: 4001 },
    { name: 'Users Service', app: usersApp, port: 4002 },
    { name: 'Fishing Service', app: fishingApp, port: 4003 },
    { name: 'Inventory Service', app: inventoryApp, port: 4004 },
    { name: 'Social Service', app: socialApp, port: 4005 },
    { name: 'Chat Service', app: chatApp, port: 4006 },
    { name: 'Weather Service', app: weatherApp, port: 4007 },
    { name: 'AI Service', app: aiApp, port: 4008 },
    { name: 'API Gateway', app: gatewayApp, port: 4000 }
  ];

  try {
    console.log('[STEP 1] Starting all 9 services on their documented ports...');
    for (const item of ports) {
      const s = await startServer(item.app, item.port);
      servers.push(s);
      console.log(`  ✔ ${item.name} successfully listening on port ${item.port}`);
    }

    console.log('\n[STEP 2] Verifying /health on all 9 services...');
    for (const item of ports) {
      const res = await fetch(`http://127.0.0.1:${item.port}/health`);
      assert.strictEqual(res.status, 200, `${item.name} health returned non-200`);
      const body = await res.json();
      assert.strictEqual(body.status, 'ok');
      console.log(`  ✔ Health check passed for ${item.name}: ${JSON.stringify(body)}`);
    }

    const GATEWAY = 'http://127.0.0.1:4000';
    console.log(`\n[STEP 3] Executing 13 End-to-End User Journeys via Gateway (${GATEWAY})...\n`);

    // Unique test identifiers to avoid conflicts
    const timestamp = Date.now();
    const userA_email = `angler_a_${timestamp}@test.fishmap.io`;
    const userA_username = `angler_a_${timestamp}`;
    const userB_email = `angler_b_${timestamp}@test.fishmap.io`;
    const userB_username = `angler_b_${timestamp}`;
    const testPassword = 'StrongPassword123!';

    // Flow 1: Register and login User A & User B
    console.log('Flow 1: Register user and log in via API Gateway...');
    const regResA = await fetch(`${GATEWAY}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userA_email, username: userA_username, password: testPassword })
    });
    const regTextA = await regResA.text();
    assert.strictEqual(regResA.status, 201, `User A registration failed: ${regTextA}`);
    const regDataA = JSON.parse(regTextA);
    const userA_id = (regDataA.user || regDataA.data?.user).id;
    console.log(`  ✔ User A registered: id=${userA_id}`);

    const regResB = await fetch(`${GATEWAY}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userB_email, username: userB_username, password: testPassword })
    });
    assert.strictEqual(regResB.status, 201);
    const regDataB = await regResB.json();
    const userB_id = (regDataB.user || regDataB.data?.user).id;
    console.log(`  ✔ User B registered: id=${userB_id}`);

    const loginResA = await fetch(`${GATEWAY}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userA_email, password: testPassword })
    });
    assert.strictEqual(loginResA.status, 200);
    const loginDataA = await loginResA.json();
    let tokenA = loginDataA.accessToken || loginDataA.data?.accessToken;
    let refreshA = loginDataA.refreshToken || loginDataA.data?.refreshToken;
    assert.ok(tokenA && refreshA);
    console.log('  ✔ User A logged in; access token and refresh token received');

    const loginResB = await fetch(`${GATEWAY}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userB_email, password: testPassword })
    });
    assert.strictEqual(loginResB.status, 200);
    const loginDataB = await loginResB.json();
    const tokenB = loginDataB.accessToken || loginDataB.data?.accessToken;
    console.log('  ✔ User B logged in');

    // Flow 2: Access protected endpoint
    console.log('\nFlow 2: Access protected endpoint with issued access token...');
    const meRes = await fetch(`${GATEWAY}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(meRes.status, 200);
    const meData = await meRes.json();
    const meUser = meData.user || meData.data?.user;
    assert.strictEqual(meUser.email, userA_email);
    console.log(`  ✔ Protected /api/v1/auth/me validated for user: ${meUser.username}`);

    // Flow 3: Refresh and revoke authentication tokens
    console.log('\nFlow 3: Refresh and revoke authentication tokens...');
    const refreshRes = await fetch(`${GATEWAY}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshA })
    });
    assert.strictEqual(refreshRes.status, 200);
    const newTokens = await refreshRes.json();
    const rotatedAccessToken = newTokens.accessToken || newTokens.data?.accessToken;
    const rotatedRefreshToken = newTokens.refreshToken || newTokens.data?.refreshToken;
    assert.notStrictEqual(rotatedRefreshToken, refreshA);
    tokenA = rotatedAccessToken;
    console.log('  ✔ Refresh token rotated successfully');

    // Test token revocation on logout
    const logoutRes = await fetch(`${GATEWAY}/api/v1/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rotatedRefreshToken })
    });
    assert.ok([200, 204].includes(logoutRes.status));
    console.log('  ✔ Token successfully revoked on logout');

    // Re-login User A for subsequent flows
    const reLogin = await (await fetch(`${GATEWAY}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userA_email, password: testPassword })
    })).json();
    tokenA = reLogin.accessToken || reLogin.data?.accessToken;

    // Flow 4: Initialize and update user profile
    console.log('\nFlow 4: Initialize and update user profile...');
    const profileRes = await fetch(`${GATEWAY}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(profileRes.status, 200);
    const profileData = (await profileRes.json()).data;
    console.log(`  ✔ Profile lazy initialized: id=${profileData.id}`);

    const updateProfileRes = await fetch(`${GATEWAY}/api/v1/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        displayName: 'Captain Bass',
        bio: 'Tournament angler and guide',
        location: 'Lake Minnetonka, MN'
      })
    });
    assert.strictEqual(updateProfileRes.status, 200);
    const updatedProfile = (await updateProfileRes.json()).data;
    assert.strictEqual(updatedProfile.displayName, 'Captain Bass');
    console.log('  ✔ Profile updated successfully');

    // Flow 5: Create and retrieve fishing spot
    console.log('\nFlow 5: Create and retrieve fishing spot (geospatial query)...');
    const createSpotRes = await fetch(`${GATEWAY}/api/v1/fishing/spots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        name: 'Gull Reef Point',
        latitude: 45.321,
        longitude: -93.654,
        water_type: 'lake',
        visibility: 'public'
      })
    });
    assert.strictEqual(createSpotRes.status, 201);
    const spot = (await createSpotRes.json()).data;
    const spotId = spot.id;
    console.log(`  ✔ Fishing spot created: id=${spotId}, name="${spot.name}"`);

    const getSpotsRes = await fetch(`${GATEWAY}/api/v1/fishing/spots?latitude=45.32&longitude=-93.65&radius=10`);
    assert.strictEqual(getSpotsRes.status, 200);
    const spotsList = await getSpotsRes.json();
    assert.ok(spotsList.data.some(s => s.id === spotId));
    console.log(`  ✔ Spot discovered via radius geo-query (found in ${spotsList.total} nearby spots)`);

    // Flow 6: Create a fishing session and record a catch
    console.log('\nFlow 6: Create fishing session and record catch...');
    const sessionRes = await fetch(`${GATEWAY}/api/v1/fishing/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Morning Bass Search',
        started_at: new Date().toISOString(),
        notes: 'Calm water, overcast'
      })
    });
    assert.strictEqual(sessionRes.status, 201);
    const session = (await sessionRes.json()).data;
    console.log(`  ✔ Fishing session created: id=${session.id}`);

    const catchRes = await fetch(`${GATEWAY}/api/v1/fishing/catches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        spot_id: spotId,
        session_id: session.id,
        species: 'Largemouth Bass',
        weight: 3.2,
        length: 48.0,
        bait: 'Yamamoto Senko Green Pumpkin',
        visibility: 'public'
      })
    });
    assert.strictEqual(catchRes.status, 201);
    const caughtFish = (await catchRes.json()).data;
    console.log(`  ✔ Catch recorded: species="${caughtFish.species}", weight=${caughtFish.weight}kg`);

    // Flow 7: Create and retrieve tackle inventory item
    console.log('\nFlow 7: Create and retrieve inventory item...');
    const createItemRes = await fetch(`${GATEWAY}/api/v1/inventory/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        name: 'Megabass Vision Oneten',
        type: 'jerkbait',
        quantity: 2,
        brand: 'Megabass',
        color: 'Elegy Bone',
        weight_grams: 14.0,
        visibility: 'friends'
      })
    });
    assert.strictEqual(createItemRes.status, 201);
    const item = (await createItemRes.json()).data;
    console.log(`  ✔ Inventory item created: id=${item.id}, name="${item.name}"`);

    const getItemsRes = await fetch(`${GATEWAY}/api/v1/inventory/items?user_id=${userA_id}`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(getItemsRes.status, 200);
    const items = (await getItemsRes.json()).data;
    assert.ok(items.some(i => i.id === item.id));
    console.log('  ✔ Inventory item retrieved');

    // Flow 8: Create social post and comment
    console.log('\nFlow 8: Create social post and comment...');
    const postRes = await fetch(`${GATEWAY}/api/v1/social/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        content: 'New personal best bass on Gull Reef Point!',
        photo_urls: ['https://example.com/bass.jpg'],
        spot_id: spotId,
        visibility: 'public'
      })
    });
    assert.strictEqual(postRes.status, 201);
    const post = (await postRes.json()).data;
    console.log(`  ✔ Social post created: id=${post.id}`);

    const commentRes = await fetch(`${GATEWAY}/api/v1/social/posts/${post.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`
      },
      body: JSON.stringify({ content: 'Awesome catch, what depth?' })
    });
    assert.strictEqual(commentRes.status, 201);
    const comment = (await commentRes.json()).data;
    console.log(`  ✔ Comment added by User B: "${comment.content}"`);

    // Flow 9: Send and accept friend request
    console.log('\nFlow 9: Send and accept friend request...');
    const friendReqRes = await fetch(`${GATEWAY}/api/v1/social/friends/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ addressee_id: userB_id })
    });
    assert.strictEqual(friendReqRes.status, 201);
    const friendship = (await friendReqRes.json()).data;
    console.log(`  ✔ Friend request sent from User A to User B: id=${friendship.id}`);

    const acceptFriendRes = await fetch(`${GATEWAY}/api/v1/social/friends/accept/${friendship.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(acceptFriendRes.status, 200);
    console.log('  ✔ Friend request accepted by User B');

    // Flow 10: Create conversation and exchange direct messages
    console.log('\nFlow 10: Create conversation and exchange direct messages...');
    const convRes = await fetch(`${GATEWAY}/api/v1/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ target_user_id: userB_id })
    });
    assert.strictEqual(convRes.status, 200);
    const conv = (await convRes.json()).data;
    console.log(`  ✔ Chat conversation initialized: id=${conv.id}`);

    const sendMsgRes = await fetch(`${GATEWAY}/api/v1/chat/conversations/${conv.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ content: 'Hey, let us fish tomorrow at 6 AM.' })
    });
    assert.strictEqual(sendMsgRes.status, 201);
    const msg = (await sendMsgRes.json()).data;
    console.log(`  ✔ Direct message sent: "${msg.content}"`);

    // Flow 11: Retrieve weather and angling suitability
    console.log('\nFlow 11: Retrieve weather and angling suitability...');
    const weatherRes = await fetch(`${GATEWAY}/api/v1/weather/current?lat=45.321&lng=-93.654`);
    assert.strictEqual(weatherRes.status, 200);
    const weatherData = (await weatherRes.json()).data;
    assert.ok(weatherData.temperatureC !== undefined);
    assert.ok(weatherData.fishingSuitability.score !== undefined);
    console.log(`  ✔ Weather conditions: temp=${weatherData.temperatureC}°C, pressure=${weatherData.pressureHpa}hPa, suitability=${weatherData.fishingSuitability.score}/10 (${weatherData.fishingSuitability.rating})`);

    // Flow 12: Request AI recommendation with deterministic fallback
    console.log('\nFlow 12: Request AI lure recommendation...');
    const aiRes = await fetch(`${GATEWAY}/api/v1/ai/recommend-lure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        species: 'Largemouth Bass',
        water_type: 'lake',
        depth_meters: 2.5,
        weather: weatherData,
        user_inventory: [item]
      })
    });
    assert.strictEqual(aiRes.status, 200);
    const aiData = (await aiRes.json()).data;
    console.log(`  ✔ AI recommendation: lure="${aiData.primaryLure}", confidence=${aiData.confidenceScore}`);

    // Flow 13: Retrieve personal fishing analytics
    console.log('\nFlow 13: Retrieve personal fishing analytics...');
    const analyticsRes = await fetch(`${GATEWAY}/api/v1/fishing/analytics/user`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(analyticsRes.status, 200);
    const analytics = (await analyticsRes.json()).data;
    assert.ok(analytics.overview.totalCatches >= 1);
    assert.strictEqual(analytics.overview.uniqueSpecies, 1);
    assert.strictEqual(analytics.overview.maxWeight, 3.2);
    console.log(`  ✔ Personal analytics: totalCatches=${analytics.overview.totalCatches}, maxWeight=${analytics.overview.maxWeight}kg, topSpot="${analytics.topSpots[0]?.spotName}"`);

    console.log('\n===============================================================');
    console.log('   ALL 13 END-TO-END FLOWS COMPLETED SUCCESSFULLY!');
    console.log('===============================================================\n');

  } finally {
    console.log('Shutting down test server instances...');
    for (const s of servers) {
      await new Promise((resolve) => s.close(resolve));
    }
    // Also disconnect databases
    await Promise.allSettled([
      authDb.close(),
      usersDb.close(),
      fishingDb.close(),
      inventoryDb.close(),
      socialDb.close(),
      chatDb.close()
    ]);
    console.log('Test servers and database connections successfully closed.');
  }
}

runAudit().catch((err) => {
  console.error('\n❌ AUDIT FAILED WITH ERROR:', err);
  process.exit(1);
});
