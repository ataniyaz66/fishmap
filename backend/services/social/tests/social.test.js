const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const postsRepository = require('../src/repositories/posts.repository');
const socialRepository = require('../src/repositories/social.repository');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'fishmap-default-dev-jwt-access-secret-32b';

function createTestToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, username: user.username, role: 'user', type: 'access' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

describe('Social Service Unit & Integration Tests', () => {
  let server;
  let baseUrl;

  let inMemoryPosts = [];
  let inMemoryComments = [];
  let inMemoryLikes = [];
  let inMemoryFriendships = [];
  let inMemoryNotifications = [];

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
    inMemoryPosts = [];
    inMemoryComments = [];
    inMemoryLikes = [];
    inMemoryFriendships = [];
    inMemoryNotifications = [];

    // Posts repository mocks
    postsRepository.create = async (data) => {
      const post = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryPosts.push(post);
      return post;
    };

    postsRepository.findById = async (id) => {
      return inMemoryPosts.find((p) => p.id === id) || null;
    };

    postsRepository.findFeed = async (allowedUserIds = [], allowedVisibilities = ['public'], limit = 20, offset = 0) => {
      const filtered = inMemoryPosts.filter((p) => {
        if (p.visibility === 'public') return true;
        if (p.visibility === 'friends' && allowedUserIds.includes(p.userId)) return true;
        return false;
      });
      return { count: filtered.length, rows: filtered.slice(offset, offset + limit) };
    };

    postsRepository.findByUserId = async (userId, allowedVisibilities = ['public'], limit = 20, offset = 0) => {
      const filtered = inMemoryPosts.filter((p) => p.userId === userId && allowedVisibilities.includes(p.visibility));
      return { count: filtered.length, rows: filtered.slice(offset, offset + limit) };
    };

    postsRepository.update = async (post, updates) => {
      Object.assign(post, updates, { updatedAt: new Date() });
      return post;
    };

    postsRepository.remove = async (post) => {
      const idx = inMemoryPosts.findIndex((p) => p.id === post.id);
      if (idx !== -1) inMemoryPosts.splice(idx, 1);
    };

    // Social repository mocks
    socialRepository.findLike = async (postId, userId) => {
      return inMemoryLikes.find((l) => l.postId === postId && l.userId === userId) || null;
    };

    socialRepository.createLike = async (postId, userId) => {
      const like = { id: crypto.randomUUID(), postId, userId, createdAt: new Date() };
      inMemoryLikes.push(like);
      return like;
    };

    socialRepository.removeLike = async (like) => {
      const idx = inMemoryLikes.findIndex((l) => l.id === like.id);
      if (idx !== -1) inMemoryLikes.splice(idx, 1);
    };

    socialRepository.countLikes = async (postId) => {
      return inMemoryLikes.filter((l) => l.postId === postId).length;
    };

    socialRepository.createComment = async (postId, userId, content) => {
      const comment = { id: crypto.randomUUID(), postId, userId, content, createdAt: new Date() };
      inMemoryComments.push(comment);
      return comment;
    };

    socialRepository.findCommentById = async (id) => {
      return inMemoryComments.find((c) => c.id === id) || null;
    };

    socialRepository.findCommentsByPostId = async (postId) => {
      const rows = inMemoryComments.filter((c) => c.postId === postId);
      return { count: rows.length, rows };
    };

    socialRepository.removeComment = async (comment) => {
      const idx = inMemoryComments.findIndex((c) => c.id === comment.id);
      if (idx !== -1) inMemoryComments.splice(idx, 1);
    };

    socialRepository.findFriendshipBetween = async (userId1, userId2) => {
      return inMemoryFriendships.find(
        (f) =>
          (f.requesterId === userId1 && f.addresseeId === userId2) ||
          (f.requesterId === userId2 && f.addresseeId === userId1)
      ) || null;
    };

    socialRepository.createFriendship = async (requesterId, addresseeId, status = 'pending') => {
      const friendship = { id: crypto.randomUUID(), requesterId, addresseeId, status, createdAt: new Date() };
      inMemoryFriendships.push(friendship);
      return friendship;
    };

    socialRepository.findFriendshipById = async (id) => {
      return inMemoryFriendships.find((f) => f.id === id) || null;
    };

    socialRepository.updateFriendship = async (friendship, updates) => {
      Object.assign(friendship, updates, { updatedAt: new Date() });
      return friendship;
    };

    socialRepository.listUserFriendships = async (userId, status = 'accepted') => {
      return inMemoryFriendships.filter(
        (f) => f.status === status && (f.requesterId === userId || f.addresseeId === userId)
      );
    };

    socialRepository.listPendingRequests = async (userId) => {
      return inMemoryFriendships.filter((f) => f.addresseeId === userId && f.status === 'pending');
    };

    socialRepository.createNotification = async (data) => {
      const n = { id: crypto.randomUUID(), ...data, read: false, createdAt: new Date() };
      inMemoryNotifications.push(n);
      return n;
    };

    socialRepository.findUserNotifications = async (userId) => {
      const rows = inMemoryNotifications.filter((n) => n.userId === userId);
      return { count: rows.length, rows };
    };

    socialRepository.countUnreadNotifications = async (userId) => {
      return inMemoryNotifications.filter((n) => n.userId === userId && !n.read).length;
    };

    socialRepository.findNotificationById = async (id) => {
      return inMemoryNotifications.find((n) => n.id === id) || null;
    };

    socialRepository.markNotificationAsRead = async (notification) => {
      notification.read = true;
      return notification;
    };

    socialRepository.markAllNotificationsAsRead = async (userId) => {
      inMemoryNotifications.forEach((n) => {
        if (n.userId === userId) n.read = true;
      });
      return true;
    };
  });

  // POSTS TESTS
  test('POST /api/v1/social/posts creates a post and lists in feed', async () => {
    const createRes = await fetch(`${baseUrl}/api/v1/social/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        content: 'Caught a 6lb bass at sunrise!',
        photo_urls: ['https://example.com/photo1.jpg'],
        visibility: 'public'
      })
    });

    assert.strictEqual(createRes.status, 201);
    const post = (await createRes.json()).data;
    assert.strictEqual(post.content, 'Caught a 6lb bass at sunrise!');
    assert.strictEqual(post.userId, userA.id);

    // Feed check
    const feedRes = await fetch(`${baseUrl}/api/v1/social/posts`);
    assert.strictEqual(feedRes.status, 200);
    const feed = await feedRes.json();
    assert.strictEqual(feed.total, 1);
    assert.strictEqual(feed.data[0].id, post.id);
  });

  test('POST /api/v1/social/posts/:id/like toggles likes and notifies author', async () => {
    const post = await postsRepository.create({
      userId: userA.id,
      content: 'Great fishing day!',
      visibility: 'public'
    });

    // Like post as user B
    const likeRes = await fetch(`${baseUrl}/api/v1/social/posts/${post.id}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(likeRes.status, 200);
    const likeData = (await likeRes.json()).data;
    assert.strictEqual(likeData.liked, true);
    assert.strictEqual(likeData.likeCount, 1);

    // Check notification was sent to user A
    assert.strictEqual(inMemoryNotifications.length, 1);
    assert.strictEqual(inMemoryNotifications[0].userId, userA.id);
    assert.strictEqual(inMemoryNotifications[0].type, 'post_like');

    // Unlike post
    const unlikeRes = await fetch(`${baseUrl}/api/v1/social/posts/${post.id}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(unlikeRes.status, 200);
    assert.strictEqual((await unlikeRes.json()).data.liked, false);
  });

  test('POST and GET /api/v1/social/posts/:id/comments adds and lists comments', async () => {
    const post = await postsRepository.create({
      userId: userA.id,
      content: 'Check out this rig',
      visibility: 'public'
    });

    // Add comment as user B
    const commentRes = await fetch(`${baseUrl}/api/v1/social/posts/${post.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`
      },
      body: JSON.stringify({ content: 'What hook size did you use?' })
    });
    assert.strictEqual(commentRes.status, 201);

    // List comments
    const listRes = await fetch(`${baseUrl}/api/v1/social/posts/${post.id}/comments`);
    assert.strictEqual(listRes.status, 200);
    const comments = await listRes.json();
    assert.strictEqual(comments.total, 1);
    assert.strictEqual(comments.data[0].content, 'What hook size did you use?');
  });

  test('Friendship lifecycle: request -> accept -> list friends', async () => {
    // 1. User A sends friend request to User B
    const reqRes = await fetch(`${baseUrl}/api/v1/social/friends/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ addressee_id: userB.id })
    });
    assert.strictEqual(reqRes.status, 201);
    const friendship = (await reqRes.json()).data;
    assert.strictEqual(friendship.status, 'pending');

    // 2. User B checks pending requests
    const pendingRes = await fetch(`${baseUrl}/api/v1/social/friends/requests`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(pendingRes.status, 200);
    assert.strictEqual((await pendingRes.json()).total, 1);

    // 3. User B accepts request
    const acceptRes = await fetch(`${baseUrl}/api/v1/social/friends/accept/${friendship.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.strictEqual(acceptRes.status, 200);

    // 4. User A and User B check friends
    const friendsRes = await fetch(`${baseUrl}/api/v1/social/friends`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(friendsRes.status, 200);
    const friendsData = await friendsRes.json();
    assert.strictEqual(friendsData.total, 1);
    assert.strictEqual(friendsData.data[0], userB.id);
  });

  test('Notifications flow: get unread count and mark as read', async () => {
    // Manually add notification for user A
    await socialRepository.createNotification({
      userId: userA.id,
      actorId: userB.id,
      type: 'post_like',
      entityId: crypto.randomUUID()
    });

    // Check unread count
    const countRes = await fetch(`${baseUrl}/api/v1/social/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(countRes.status, 200);
    assert.strictEqual((await countRes.json()).data.unreadCount, 1);

    // Mark all as read
    const readAllRes = await fetch(`${baseUrl}/api/v1/social/notifications/read-all`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual(readAllRes.status, 200);

    // Check count is now 0
    const countRes2 = await fetch(`${baseUrl}/api/v1/social/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.strictEqual((await countRes2.json()).data.unreadCount, 0);
  });
});
