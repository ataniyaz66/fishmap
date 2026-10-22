const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const config = require('../src/config/env');
const {
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} = require('../src/utils/token');
const { hashPassword, comparePassword } = require('../src/utils/password');

describe('Password Hashing & Verification Tests', () => {
  test('hashPassword generates valid bcrypt hash with salt', async () => {
    const plain = 'SecretPassword123!';
    const hash = await hashPassword(plain);

    assert.ok(hash.startsWith('$2a$') || hash.startsWith('$2b$'), 'Hash should be valid bcrypt format');
    assert.notStrictEqual(hash, plain, 'Plaintext password must not be stored');
  });

  test('comparePassword returns true for matching password', async () => {
    const plain = 'ValidPassword_2026';
    const hash = await hashPassword(plain);

    const isMatch = await comparePassword(plain, hash);
    assert.strictEqual(isMatch, true);
  });

  test('comparePassword returns false for non-matching password', async () => {
    const plain = 'CorrectPassword';
    const hash = await hashPassword(plain);

    const isMatch = await comparePassword('WrongPassword', hash);
    assert.strictEqual(isMatch, false);
  });

  test('comparePassword handles empty, null or undefined input safely', async () => {
    assert.strictEqual(await comparePassword(null, 'somehash'), false);
    assert.strictEqual(await comparePassword('password', null), false);
    assert.strictEqual(await comparePassword('', ''), false);
  });
});

describe('Token Utilities Tests', () => {
  const dummyUser = {
    id: '12345678-1234-1234-1234-1234567890ab',
    email: 'angler@example.com',
    username: 'river_angler',
    role: 'user'
  };

  test('hashToken produces deterministic SHA-256 hash', () => {
    const hash1 = hashToken('test-token-123');
    const hash2 = hashToken('test-token-123');
    const hash3 = hashToken('different-token');

    assert.strictEqual(hash1, hash2);
    assert.notStrictEqual(hash1, hash3);
    assert.strictEqual(hash1.length, 64);
  });

  test('generateAccessToken creates valid access token with correct claims', () => {
    const result = generateAccessToken(dummyUser);

    assert.ok(result.token, 'Token string should exist');
    assert.strictEqual(result.expiresIn, 900);

    const decoded = jwt.decode(result.token);
    assert.strictEqual(decoded.sub, dummyUser.id);
    assert.strictEqual(decoded.email, dummyUser.email);
    assert.strictEqual(decoded.username, dummyUser.username);
    assert.strictEqual(decoded.role, 'user');
    assert.strictEqual(decoded.type, 'access');
  });

  test('verifyAccessToken validates correct token and rejects tampered token', () => {
    const { token } = generateAccessToken(dummyUser);
    const verified = verifyAccessToken(token);

    assert.strictEqual(verified.sub, dummyUser.id);

    // Tampered token
    const tampered = token.slice(0, -5) + 'xxxxx';
    assert.throws(() => verifyAccessToken(tampered), {
      name: 'AppError',
      statusCode: 401,
      code: 'UNAUTHORIZED'
    });
  });

  test('generateRefreshToken creates token with jti, familyId, and purpose claims', () => {
    const result = generateRefreshToken(dummyUser);

    assert.ok(result.token);
    assert.ok(result.jti);
    assert.ok(result.familyId);
    assert.ok(result.tokenHash);
    assert.strictEqual(result.expiresIn, 2592000);

    const verified = verifyRefreshToken(result.token);
    assert.strictEqual(verified.sub, dummyUser.id);
    assert.strictEqual(verified.familyId, result.familyId);
    assert.strictEqual(verified.jti, result.jti);
    assert.strictEqual(verified.purpose, 'refresh');
    assert.strictEqual(verified.type, 'refresh');
  });

  test('generateRefreshToken preserves existing familyId during rotation', () => {
    const existingFamily = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
    const result = generateRefreshToken(dummyUser, existingFamily);

    assert.strictEqual(result.familyId, existingFamily);
    const verified = verifyRefreshToken(result.token);
    assert.strictEqual(verified.familyId, existingFamily);
  });

  test('verifyAccessToken rejects refresh tokens', () => {
    const refreshResult = generateRefreshToken(dummyUser);
    assert.throws(() => verifyAccessToken(refreshResult.token), {
      name: 'AppError',
      statusCode: 401,
      code: 'UNAUTHORIZED'
    });
  });

  test('verifyRefreshToken rejects access tokens', () => {
    const accessResult = generateAccessToken(dummyUser);
    assert.throws(() => verifyRefreshToken(accessResult.token), {
      name: 'AppError',
      statusCode: 401,
      code: 'INVALID_REFRESH_TOKEN'
    });
  });

  test('verifyAccessToken rejects expired tokens', () => {
    const expiredToken = jwt.sign(
      { sub: dummyUser.id, type: 'access' },
      config.jwtAccessSecret,
      { expiresIn: '-1s' }
    );

    assert.throws(() => verifyAccessToken(expiredToken), {
      name: 'AppError',
      statusCode: 401,
      code: 'UNAUTHORIZED'
    });
  });
});
