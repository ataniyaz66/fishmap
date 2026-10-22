const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { authenticateToken, requireRole } = require('../src/middlewares/auth.middleware');
const { generateAccessToken, generateRefreshToken } = require('../src/utils/token');

describe('Authentication Middleware Tests', () => {
  const dummyUser = {
    id: '99999999-9999-9999-9999-999999999999',
    email: 'test@example.com',
    username: 'tester',
    role: 'user'
  };

  test('calls next with 401 when Authorization header is missing', () => {
    const req = { headers: {} };
    const res = {};
    let caughtError = null;

    authenticateToken(req, res, (err) => {
      caughtError = err;
    });

    assert.ok(caughtError);
    assert.strictEqual(caughtError.statusCode, 401);
    assert.strictEqual(caughtError.code, 'UNAUTHORIZED');
  });

  test('calls next with 401 when Authorization header does not use Bearer schema', () => {
    const req = { headers: { authorization: 'Basic dXNlcjpwYXNz' } };
    let caughtError = null;

    authenticateToken(req, {}, (err) => {
      caughtError = err;
    });

    assert.ok(caughtError);
    assert.strictEqual(caughtError.statusCode, 401);
    assert.strictEqual(caughtError.code, 'UNAUTHORIZED');
  });

  test('calls next with 401 when token is invalid or malformed', () => {
    const req = { headers: { authorization: 'Bearer invalid.token.payload' } };
    let caughtError = null;

    authenticateToken(req, {}, (err) => {
      caughtError = err;
    });

    assert.ok(caughtError);
    assert.strictEqual(caughtError.statusCode, 401);
    assert.strictEqual(caughtError.code, 'UNAUTHORIZED');
  });

  test('calls next with 401 when token is a refresh token instead of access token', () => {
    const { token } = generateRefreshToken(dummyUser);
    const req = { headers: { authorization: `Bearer ${token}` } };
    let caughtError = null;

    authenticateToken(req, {}, (err) => {
      caughtError = err;
    });

    assert.ok(caughtError);
    assert.strictEqual(caughtError.statusCode, 401);
    assert.strictEqual(caughtError.code, 'UNAUTHORIZED');
  });

  test('attaches verified user identity to req.user on valid Bearer access token', () => {
    const { token } = generateAccessToken(dummyUser);
    const req = { headers: { authorization: `Bearer ${token}` } };
    let calledNext = false;

    authenticateToken(req, {}, (err) => {
      assert.strictEqual(err, undefined);
      calledNext = true;
    });

    assert.strictEqual(calledNext, true);
    assert.ok(req.user);
    assert.strictEqual(req.user.id, dummyUser.id);
    assert.strictEqual(req.user.email, dummyUser.email);
    assert.strictEqual(req.user.username, dummyUser.username);
    assert.strictEqual(req.user.role, 'user');
  });

  test('requireRole allows matching role and forbids mismatching role', () => {
    const adminUser = { user: { id: 'admin', role: 'admin' } };
    const normalUser = { user: { id: 'user', role: 'user' } };

    const adminGuard = requireRole('admin');

    // Admin passes
    let adminPassed = false;
    adminGuard(adminUser, {}, (err) => {
      assert.strictEqual(err, undefined);
      adminPassed = true;
    });
    assert.strictEqual(adminPassed, true);

    // Normal user rejected with 403
    let userError = null;
    adminGuard(normalUser, {}, (err) => {
      userError = err;
    });
    assert.ok(userError);
    assert.strictEqual(userError.statusCode, 403);
    assert.strictEqual(userError.code, 'FORBIDDEN');
  });
});
