const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  validateRegistration,
  validateLogin,
  validateTokenPayload
} = require('../src/utils/validation');
const { createRateLimiter } = require('../src/middlewares/rate-limit.middleware');

describe('Registration Validation Tests', () => {
  test('valid registration payload passes and lowercases email', () => {
    const valid = {
      email: 'Angler.Pro@EXAMPLE.com',
      username: 'pro_angler_99',
      password: 'StrongPassword123'
    };

    const result = validateRegistration(valid);
    assert.strictEqual(result.email, 'angler.pro@example.com');
    assert.strictEqual(result.username, 'pro_angler_99');
    assert.strictEqual(result.password, 'StrongPassword123');
  });

  test('rejects non-object or missing body', () => {
    assert.throws(() => validateRegistration(null), {
      name: 'AppError',
      statusCode: 400,
      code: 'VALIDATION_ERROR'
    });
    assert.throws(() => validateRegistration('string'), {
      name: 'AppError',
      statusCode: 400
    });
  });

  test('validates email format, missing email, and length', () => {
    assert.throws(
      () => validateRegistration({ email: 'not-an-email', username: 'angler', password: 'password123' }),
      (err) => {
        assert.strictEqual(err.statusCode, 400);
        assert.ok(err.details.some((d) => d.field === 'email'));
        return true;
      }
    );
  });

  test('validates username constraints (length and characters)', () => {
    // Too short
    assert.throws(
      () => validateRegistration({ email: 'a@b.com', username: 'ab', password: 'password123' }),
      (err) => err.details.some((d) => d.field === 'username')
    );
    // Invalid characters (spaces, special chars)
    assert.throws(
      () => validateRegistration({ email: 'a@b.com', username: 'angler with spaces!', password: 'password123' }),
      (err) => err.details.some((d) => d.field === 'username')
    );
  });

  test('validates minimum password length of 8 characters', () => {
    assert.throws(
      () => validateRegistration({ email: 'a@b.com', username: 'angler', password: 'short' }),
      (err) => err.details.some((d) => d.field === 'password')
    );
  });
});

describe('Login Validation Tests', () => {
  test('accepts valid email and password', () => {
    const res = validateLogin({ email: 'User@Example.COM', password: 'Password123' });
    assert.strictEqual(res.email, 'user@example.com');
    assert.strictEqual(res.password, 'Password123');
    assert.strictEqual(res.username, undefined);
  });

  test('accepts valid username and password', () => {
    const res = validateLogin({ username: 'angler_bob', password: 'Password123' });
    assert.strictEqual(res.username, 'angler_bob');
    assert.strictEqual(res.password, 'Password123');
    assert.strictEqual(res.email, undefined);
  });

  test('rejects when both email and username are missing', () => {
    assert.throws(() => validateLogin({ password: 'Password123' }), {
      name: 'AppError',
      statusCode: 400
    });
  });

  test('rejects when both email and username are supplied simultaneously', () => {
    assert.throws(
      () => validateLogin({ email: 'a@b.com', username: 'angler', password: 'Password123' }),
      (err) => err.details.some((d) => d.field === 'identifier')
    );
  });

  test('rejects missing or empty password', () => {
    assert.throws(
      () => validateLogin({ email: 'a@b.com', password: '   ' }),
      (err) => err.details.some((d) => d.field === 'password')
    );
  });
});

describe('Token Payload Validation Tests', () => {
  test('returns trimmed refreshToken string', () => {
    const token = validateTokenPayload({ refreshToken: '  my-token  ' });
    assert.strictEqual(token, 'my-token');
  });

  test('rejects missing or blank refreshToken', () => {
    assert.throws(() => validateTokenPayload({ refreshToken: '' }), {
      name: 'AppError',
      statusCode: 400
    });
    assert.throws(() => validateTokenPayload({}), {
      name: 'AppError',
      statusCode: 400
    });
  });
});

describe('Rate Limiter Middleware Tests', () => {
  test('allows requests within threshold and blocks exceeding requests with 429', () => {
    const limiter = createRateLimiter({
      windowMs: 1000,
      max: 3,
      message: 'Rate limit exceeded'
    });

    const headers = {};
    const req = {
      ip: '192.168.1.100',
      path: '/test-route',
      headers: {}
    };
    const res = {
      setHeader: (k, v) => { headers[k] = v; }
    };

    // Requests 1, 2, 3 succeed
    let err = null;
    limiter(req, res, (e) => { err = e; });
    assert.strictEqual(err, undefined);
    assert.strictEqual(headers['X-RateLimit-Remaining'], 2);

    limiter(req, res, (e) => { err = e; });
    assert.strictEqual(err, undefined);
    assert.strictEqual(headers['X-RateLimit-Remaining'], 1);

    limiter(req, res, (e) => { err = e; });
    assert.strictEqual(err, undefined);
    assert.strictEqual(headers['X-RateLimit-Remaining'], 0);

    // Request 4 exceeds limit
    limiter(req, res, (e) => { err = e; });
    assert.ok(err);
    assert.strictEqual(err.statusCode, 429);
    assert.strictEqual(err.code, 'TOO_MANY_REQUESTS');
    assert.ok(headers['Retry-After']);
  });
});
