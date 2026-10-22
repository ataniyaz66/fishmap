const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const authService = require('../src/services/auth.service');
const authRepository = require('../src/repositories/auth.repository');
const { hashPassword } = require('../src/utils/password');
const { generateRefreshToken, hashToken } = require('../src/utils/token');

describe('Auth Service Business Logic Tests', () => {
  // In-memory data store to simulate repository
  let usersStore = [];
  let refreshTokensStore = [];

  beforeEach(() => {
    usersStore = [];
    refreshTokensStore = [];

    // Mock authRepository functions
    authRepository.findByEmail = async (email) => {
      const lower = email.toLowerCase().trim();
      return usersStore.find((u) => u.email.toLowerCase() === lower) || null;
    };

    authRepository.findByUsername = async (username) => {
      const lower = username.toLowerCase().trim();
      return usersStore.find((u) => u.username.toLowerCase() === lower) || null;
    };

    authRepository.findById = async (id) => {
      return usersStore.find((u) => u.id === id) || null;
    };

    authRepository.createUser = async (userData) => {
      const user = {
        id: crypto.randomUUID(),
        email: userData.email,
        username: userData.username,
        passwordHash: userData.passwordHash,
        accountStatus: userData.accountStatus || 'active',
        createdAt: new Date().toISOString()
      };
      usersStore.push(user);
      return user;
    };

    authRepository.createRefreshToken = async (data) => {
      const record = {
        id: crypto.randomUUID(),
        userId: data.userId,
        tokenHash: data.tokenHash,
        familyId: data.familyId,
        expiresAt: data.expiresAt,
        isRevoked: data.isRevoked || false
      };
      refreshTokensStore.push(record);
      return record;
    };

    authRepository.findRefreshTokenByHash = async (tokenHash) => {
      return refreshTokensStore.find((t) => t.tokenHash === tokenHash) || null;
    };

    authRepository.revokeRefreshToken = async (tokenHash) => {
      const token = refreshTokensStore.find((t) => t.tokenHash === tokenHash);
      if (token) {
        token.isRevoked = true;
      }
      return [token ? 1 : 0];
    };

    authRepository.revokeFamily = async (familyId) => {
      let count = 0;
      for (const t of refreshTokensStore) {
        if (t.familyId === familyId) {
          t.isRevoked = true;
          count++;
        }
      }
      return [count];
    };
  });

  describe('register()', () => {
    test('successfully registers a user with hashed password and returns clean payload', async () => {
      const payload = {
        email: 'angler@example.com',
        username: 'river_angler',
        password: 'super-secret-password-123'
      };

      const result = await authService.register(payload);

      assert.ok(result.user);
      assert.ok(result.user.id);
      assert.strictEqual(result.user.email, 'angler@example.com');
      assert.strictEqual(result.user.username, 'river_angler');
      assert.strictEqual(result.user.status, 'active');
      assert.ok(result.user.createdAt);
      assert.strictEqual(result.user.password, undefined);
      assert.strictEqual(result.user.passwordHash, undefined);

      // Verify record stored in DB has hashed password
      const stored = usersStore[0];
      assert.strictEqual(stored.email, 'angler@example.com');
      assert.notStrictEqual(stored.passwordHash, payload.password);
      assert.ok(stored.passwordHash.startsWith('$2'));
    });

    test('rejects registration when email already exists (case-insensitive)', async () => {
      usersStore.push({
        id: crypto.randomUUID(),
        email: 'existing@example.com',
        username: 'existing_user',
        passwordHash: 'hash',
        accountStatus: 'active'
      });

      await assert.rejects(
        () => authService.register({
          email: 'EXISTING@example.com',
          username: 'new_unique_user',
          password: 'password123'
        }),
        {
          name: 'AppError',
          statusCode: 409,
          code: 'EMAIL_ALREADY_EXISTS'
        }
      );
    });

    test('rejects registration when username already exists (case-insensitive)', async () => {
      usersStore.push({
        id: crypto.randomUUID(),
        email: 'existing@example.com',
        username: 'FishMaster',
        passwordHash: 'hash',
        accountStatus: 'active'
      });

      await assert.rejects(
        () => authService.register({
          email: 'unique@example.com',
          username: 'fishmaster',
          password: 'password123'
        }),
        {
          name: 'AppError',
          statusCode: 409,
          code: 'USERNAME_ALREADY_EXISTS'
        }
      );
    });
  });

  describe('login()', () => {
    let testPassword = 'Password123!';
    let testUser;

    beforeEach(async () => {
      const passwordHash = await hashPassword(testPassword);
      testUser = {
        id: crypto.randomUUID(),
        email: 'angler@example.com',
        username: 'river_angler',
        passwordHash,
        accountStatus: 'active'
      };
      usersStore.push(testUser);
    });

    test('successfully authenticates with email', async () => {
      const result = await authService.login({
        email: 'ANGLER@example.com',
        password: testPassword
      });

      assert.ok(result.accessToken);
      assert.ok(result.refreshToken);
      assert.strictEqual(result.tokenType, 'Bearer');
      assert.strictEqual(result.accessTokenExpiresIn, 900);
      assert.strictEqual(result.refreshTokenExpiresIn, 2592000);
      assert.strictEqual(result.user.id, testUser.id);
      assert.strictEqual(result.user.email, testUser.email);

      // Verify refresh token recorded in store
      assert.strictEqual(refreshTokensStore.length, 1);
      assert.strictEqual(refreshTokensStore[0].userId, testUser.id);
      assert.strictEqual(refreshTokensStore[0].isRevoked, false);
    });

    test('successfully authenticates with username', async () => {
      const result = await authService.login({
        username: 'RIVER_ANGLER',
        password: testPassword
      });

      assert.ok(result.accessToken);
      assert.strictEqual(result.user.username, 'river_angler');
    });

    test('rejects login with wrong password', async () => {
      await assert.rejects(
        () => authService.login({
          email: 'angler@example.com',
          password: 'WrongPassword999'
        }),
        {
          name: 'AppError',
          statusCode: 401,
          code: 'INVALID_CREDENTIALS'
        }
      );
    });

    test('rejects login with non-existent identifier', async () => {
      await assert.rejects(
        () => authService.login({
          email: 'nobody@example.com',
          password: testPassword
        }),
        {
          name: 'AppError',
          statusCode: 401,
          code: 'INVALID_CREDENTIALS'
        }
      );
    });

    test('rejects login for inactive account with 403 ACCOUNT_INACTIVE', async () => {
      testUser.accountStatus = 'suspended';

      await assert.rejects(
        () => authService.login({
          email: 'angler@example.com',
          password: testPassword
        }),
        {
          name: 'AppError',
          statusCode: 403,
          code: 'ACCOUNT_INACTIVE'
        }
      );
    });
  });

  describe('refresh() and Token Rotation', () => {
    let testUser;
    let initialRefreshToken;

    beforeEach(async () => {
      testUser = {
        id: crypto.randomUUID(),
        email: 'angler@example.com',
        username: 'river_angler',
        passwordHash: 'hash',
        accountStatus: 'active'
      };
      usersStore.push(testUser);

      initialRefreshToken = generateRefreshToken(testUser);
      refreshTokensStore.push({
        id: crypto.randomUUID(),
        userId: testUser.id,
        tokenHash: initialRefreshToken.tokenHash,
        familyId: initialRefreshToken.familyId,
        expiresAt: initialRefreshToken.expiresAt,
        isRevoked: false
      });
    });

    test('successfully rotates refresh token and issues new token pair', async () => {
      const result = await authService.refresh({
        refreshToken: initialRefreshToken.token
      });

      assert.ok(result.accessToken);
      assert.ok(result.refreshToken);
      assert.notStrictEqual(result.refreshToken, initialRefreshToken.token);

      // Verify old token is now marked as revoked
      const oldRecord = refreshTokensStore.find((t) => t.tokenHash === initialRefreshToken.tokenHash);
      assert.strictEqual(oldRecord.isRevoked, true);

      // Verify new token is stored and unrevoked in the same family
      const newHash = hashToken(result.refreshToken);
      const newRecord = refreshTokensStore.find((t) => t.tokenHash === newHash);
      assert.ok(newRecord);
      assert.strictEqual(newRecord.isRevoked, false);
      assert.strictEqual(newRecord.familyId, initialRefreshToken.familyId);
    });

    test('detects token reuse and revokes entire family', async () => {
      // Rotate once
      const firstRotation = await authService.refresh({
        refreshToken: initialRefreshToken.token
      });

      // Attempt to reuse initialRefreshToken (which was already rotated)
      await assert.rejects(
        () => authService.refresh({
          refreshToken: initialRefreshToken.token
        }),
        {
          name: 'AppError',
          statusCode: 401,
          code: 'INVALID_REFRESH_TOKEN'
        }
      );

      // Verify that the NEW token from the first rotation was ALSO revoked due to family revocation!
      const newHash = hashToken(firstRotation.refreshToken);
      const newRecord = refreshTokensStore.find((t) => t.tokenHash === newHash);
      assert.strictEqual(newRecord.isRevoked, true, 'New token in family must be revoked when reuse is detected');
    });

    test('rejects expired refresh token record', async () => {
      const expiredRecord = refreshTokensStore[0];
      expiredRecord.expiresAt = new Date(Date.now() - 10000).toISOString();

      await assert.rejects(
        () => authService.refresh({
          refreshToken: initialRefreshToken.token
        }),
        {
          name: 'AppError',
          statusCode: 401,
          code: 'INVALID_REFRESH_TOKEN'
        }
      );
    });
  });

  describe('logout()', () => {
    test('revokes refresh token and executes idempotently', async () => {
      const dummyUser = { id: crypto.randomUUID() };
      const token = generateRefreshToken(dummyUser);
      refreshTokensStore.push({
        id: crypto.randomUUID(),
        userId: dummyUser.id,
        tokenHash: token.tokenHash,
        familyId: token.familyId,
        expiresAt: token.expiresAt,
        isRevoked: false
      });

      await authService.logout({ refreshToken: token.token });

      const record = refreshTokensStore.find((t) => t.tokenHash === token.tokenHash);
      assert.strictEqual(record.isRevoked, true);

      // Calling logout again does not throw
      await authService.logout({ refreshToken: token.token });
    });
  });
});
