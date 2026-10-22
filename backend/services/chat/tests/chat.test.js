const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const chatRepository = require('../src/repositories/chat.repository');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'fishmap-default-dev-jwt-access-secret-32b';

function createTestToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, username: user.username, role: 'user', type: 'access' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

describe('Chat Service Unit & Integration Tests', () => {
  let server;
  let baseUrl;

  let inMemoryConversations = [];
  let inMemoryMessages = [];

  const userA = { id: crypto.randomUUID(), email: 'anglerA@example.com', username: 'angler_a' };
  const userB = { id: crypto.randomUUID(), email: 'anglerB@example.com', username: 'angler_b' };
  const userC = { id: crypto.randomUUID(), email: 'anglerC@example.com', username: 'angler_c' };

  const tokenA = createTestToken(userA);
  const tokenB = createTestToken(userB);
  const tokenC = createTestToken(userC);

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
    inMemoryConversations = [];
    inMemoryMessages = [];

    chatRepository.findConversationBetween = async (user1, user2) => {
      return inMemoryConversations.find(
        (c) =>
          (c.participant1Id === user1 && c.participant2Id === user2) ||
          (c.participant1Id === user2 && c.participant2Id === user1)
      ) || null;
    };

    chatRepository.createConversation = async (user1, user2) => {
      const conversation = {
        id: crypto.randomUUID(),
        participant1Id: user1,
        participant2Id: user2,
        lastMessageAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryConversations.push(conversation);
      return conversation;
    };

    chatRepository.findConversationById = async (id) => {
      return inMemoryConversations.find((c) => c.id === id) || null;
    };

    chatRepository.listUserConversations = async (userId) => {
      return inMemoryConversations.filter(
        (c) => c.participant1Id === userId || c.participant2Id === userId
      );
    };

    chatRepository.updateConversation = async (conversation, updates) => {
      Object.assign(conversation, updates, { updatedAt: new Date() });
      return conversation;
    };

    chatRepository.createMessage = async (conversationId, senderId, content) => {
      const msg = {
        id: crypto.randomUUID(),
        conversationId,
        senderId,
        content,
        read: false,
        readAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryMessages.push(msg);
      return msg;
    };

    chatRepository.findMessagesByConversation = async (conversationId, limit = 50, offset = 0) => {
      const msgs = inMemoryMessages.filter((m) => m.conversationId === conversationId);
      return { count: msgs.length, rows: msgs.slice(offset, offset + limit) };
    };

    chatRepository.markMessagesAsRead = async (conversationId, recipientId) => {
      inMemoryMessages.forEach((m) => {
        if (m.conversationId === conversationId && m.senderId !== recipientId) {
          m.read = true;
          m.readAt = new Date();
        }
      });
      return true;
    };
  });

  test('POST /api/v1/chat/conversations creates or returns existing conversation', async () => {
    // 1. Create conversation between A and B
    const createRes = await fetch(`${baseUrl}/api/v1/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ target_user_id: userB.id })
    });
    assert.strictEqual(createRes.status, 200);
    const conv = (await createRes.json()).data;
    assert.ok(conv.id);

    // 2. Calling again returns the existing one
    const getRes = await fetch(`${baseUrl}/api/v1/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`
      },
      body: JSON.stringify({ target_user_id: userA.id })
    });
    assert.strictEqual(getRes.status, 200);
    assert.strictEqual((await getRes.json()).data.id, conv.id);
    assert.strictEqual(inMemoryConversations.length, 1);
  });

  test('POST /api/v1/chat/conversations rejects conversation with self', async () => {
    const res = await fetch(`${baseUrl}/api/v1/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ target_user_id: userA.id })
    });
    assert.strictEqual(res.status, 400);
  });

  test('Messaging flow: send message, retrieve history, and mark read', async () => {
    const conv = await chatRepository.createConversation(userA.id, userB.id);

    // 1. User A sends message to User B
    const sendRes = await fetch(`${baseUrl}/api/v1/chat/conversations/${conv.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ content: 'Are you heading to Lake Minnetonka tomorrow?' })
    });
    assert.strictEqual(sendRes.status, 201);
    const msg = (await sendRes.json()).data;
    assert.strictEqual(msg.content, 'Are you heading to Lake Minnetonka tomorrow?');
    assert.strictEqual(msg.read, false);

    // 2. User B reads messages
    const getRes = await fetch(`${baseUrl}/api/v1/chat/conversations/${conv.id}/messages`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(getRes.status, 200);
    const history = await getRes.json();
    assert.strictEqual(history.total, 1);
    assert.strictEqual(history.messages[0].id, msg.id);

    // 3. User B marks conversation as read
    const readRes = await fetch(`${baseUrl}/api/v1/chat/conversations/${conv.id}/read`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(readRes.status, 200);
    assert.strictEqual(inMemoryMessages[0].read, true);
  });

  test('Unauthorized user C cannot access conversation between A and B', async () => {
    const conv = await chatRepository.createConversation(userA.id, userB.id);

    // User C tries to read messages
    const getRes = await fetch(`${baseUrl}/api/v1/chat/conversations/${conv.id}/messages`, {
      headers: { Authorization: `Bearer ${tokenC}` }
    });
    assert.strictEqual(getRes.status, 403);

    // User C tries to send message
    const sendRes = await fetch(`${baseUrl}/api/v1/chat/conversations/${conv.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenC}`
      },
      body: JSON.stringify({ content: 'Spying on you' })
    });
    assert.strictEqual(sendRes.status, 403);
  });
});
