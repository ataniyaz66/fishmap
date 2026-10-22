const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const authService = require('../src/services/auth.service');
const authRepository = require('../src/repositories/auth.repository');
const { hashPassword, comparePassword } = require('../src/utils/password');
const { hashToken } = require('../src/utils/token');

describe('Password Reset & Email Verification Tests', () => {
  let users = [];
  let resets = [];
  let verifications = [];

  beforeEach(() => {
    users = [];
    resets = [];
    verifications = [];

    authRepository.findByEmail = async (email) => {
      return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
    };

    authRepository.findById = async (id) => {
      return users.find((u) => u.id === id) || null;
    };

    authRepository.updateUserPassword = async (id, newHash) => {
      const u = users.find((user) => user.id === id);
      if (u) u.passwordHash = newHash;
    };

    authRepository.createPasswordReset = async (data) => {
      const rec = { id: crypto.randomUUID(), ...data };
      resets.push(rec);
      return rec;
    };

    authRepository.findPasswordResetByHash = async (tokenHash) => {
      return resets.find((r) => r.tokenHash === tokenHash) || null;
    };

    authRepository.markPasswordResetUsed = async (id) => {
      const rec = resets.find((r) => r.id === id);
      if (rec) rec.isUsed = true;
    };

    authRepository.createEmailVerification = async (data) => {
      const rec = { id: crypto.randomUUID(), ...data };
      verifications.push(rec);
      return rec;
    };

    authRepository.findEmailVerificationByHash = async (tokenHash) => {
      return verifications.find((v) => v.tokenHash === tokenHash) || null;
    };

    authRepository.markEmailVerified = async (id) => {
      const rec = verifications.find((v) => v.id === id);
      if (rec) rec.isUsed = true;
    };
  });

  test('forgotPassword dispatches reset record for existing active user', async () => {
    users.push({
      id: crypto.randomUUID(),
      email: 'angler@example.com',
      username: 'angler',
      passwordHash: 'hash',
      accountStatus: 'active'
    });

    const res = await authService.forgotPassword({ email: 'angler@example.com' });
    assert.ok(res.message);
    assert.strictEqual(resets.length, 1);
    assert.strictEqual(resets[0].isUsed, false);
  });

  test('forgotPassword returns generic message even if user does not exist (no enumeration)', async () => {
    const res = await authService.forgotPassword({ email: 'unknown@example.com' });
    assert.ok(res.message);
    assert.strictEqual(resets.length, 0);
  });

  test('resetPassword updates user password and marks token used', async () => {
    const initialHash = await hashPassword('InitialPass123!');
    const user = {
      id: crypto.randomUUID(),
      email: 'angler@example.com',
      passwordHash: initialHash,
      accountStatus: 'active'
    };
    users.push(user);

    const rawToken = 'sample-plain-reset-token-32-chars';
    resets.push({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + 3600000),
      isUsed: false
    });

    const newPassword = 'BrandNewPassword999!';
    const result = await authService.resetPassword({
      token: rawToken,
      newPassword
    });

    assert.ok(result.message);
    assert.strictEqual(resets[0].isUsed, true);

    // Verify password in store actually updated
    const isNewPass = await comparePassword(newPassword, user.passwordHash);
    assert.strictEqual(isNewPass, true);

    // Attempting to reuse the token fails
    await assert.rejects(
      () => authService.resetPassword({ token: rawToken, newPassword: 'AnotherPassword123!' }),
      { statusCode: 400, code: 'INVALID_TOKEN' }
    );
  });

  test('verifyEmail validates token and marks verified', async () => {
    const rawToken = 'verify-token-123';
    verifications.push({
      id: crypto.randomUUID(),
      userId: crypto.randomUUID(),
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + 3600000),
      isUsed: false
    });

    const res = await authService.verifyEmail({ token: rawToken });
    assert.ok(res.message);
    assert.strictEqual(verifications[0].isUsed, true);

    // Reusing fails
    await assert.rejects(
      () => authService.verifyEmail({ token: rawToken }),
      { statusCode: 400, code: 'INVALID_TOKEN' }
    );
  });
});
