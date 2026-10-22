const crypto = require('crypto');
const authRepository = require('../repositories/auth.repository');
const emailService = require('./email.service');
const { hashPassword, comparePassword } = require('../utils/password');
const {
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/token');
const {
  validateRegistration,
  validateLogin,
  validateTokenPayload
} = require('../utils/validation');
const AppError = require('../utils/app-error');

async function register(payload) {
  const { email, username, password } = validateRegistration(payload);

  const existingEmail = await authRepository.findByEmail(email);
  if (existingEmail) {
    throw new AppError('The requested email belongs to an existing account.', 409, 'EMAIL_ALREADY_EXISTS');
  }

  const existingUsername = await authRepository.findByUsername(username);
  if (existingUsername) {
    throw new AppError('The requested username is already in use.', 409, 'USERNAME_ALREADY_EXISTS');
  }

  const passwordHash = await hashPassword(password);

  const user = await authRepository.createUser({
    email,
    username,
    passwordHash,
    accountStatus: 'active'
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      status: user.accountStatus,
      createdAt: user.createdAt
    }
  };
}

async function login(payload) {
  const { email, username, password } = validateLogin(payload);

  const user = email
    ? await authRepository.findByEmail(email)
    : await authRepository.findByUsername(username);

  if (!user) {
    throw new AppError('Email/username and password combination is invalid.', 401, 'INVALID_CREDENTIALS');
  }

  const isPasswordMatch = await comparePassword(password, user.passwordHash);
  if (!isPasswordMatch) {
    throw new AppError('Email/username and password combination is invalid.', 401, 'INVALID_CREDENTIALS');
  }

  if (user.accountStatus !== 'active') {
    throw new AppError('Account is not active.', 403, 'ACCOUNT_INACTIVE');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await authRepository.createRefreshToken({
    userId: user.id,
    tokenHash: refreshToken.tokenHash,
    familyId: refreshToken.familyId,
    expiresAt: refreshToken.expiresAt,
    isRevoked: false
  });

  return {
    accessToken: accessToken.token,
    refreshToken: refreshToken.token,
    tokenType: 'Bearer',
    accessTokenExpiresIn: accessToken.expiresIn,
    refreshTokenExpiresIn: refreshToken.expiresIn,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      status: user.accountStatus
    }
  };
}

async function refresh(payload) {
  const tokenString = validateTokenPayload(payload, 'refreshToken');

  // Verify signature, expiry, and purpose claims
  const tokenPayload = verifyRefreshToken(tokenString);

  const tokenHash = hashToken(tokenString);
  const tokenRecord = await authRepository.findRefreshTokenByHash(tokenHash);

  if (!tokenRecord) {
    throw new AppError('The refresh token is invalid, expired, revoked, or has the wrong purpose.', 401, 'INVALID_REFRESH_TOKEN');
  }

  if (tokenRecord.isRevoked) {
    // Refresh token reuse detected: revoke the entire family for security
    await authRepository.revokeFamily(tokenRecord.familyId);
    throw new AppError('The refresh token is invalid, expired, revoked, or has the wrong purpose.', 401, 'INVALID_REFRESH_TOKEN');
  }

  if (new Date(tokenRecord.expiresAt) < new Date()) {
    throw new AppError('The refresh token is invalid, expired, revoked, or has the wrong purpose.', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await authRepository.findById(tokenRecord.userId);
  if (!user || user.accountStatus !== 'active') {
    throw new AppError('The refresh token is invalid, expired, revoked, or has the wrong purpose.', 401, 'INVALID_REFRESH_TOKEN');
  }

  // Revoke the current token
  await authRepository.revokeRefreshToken(tokenHash);

  // Issue new pair under the same family
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user, tokenRecord.familyId);

  await authRepository.createRefreshToken({
    userId: user.id,
    tokenHash: newRefreshToken.tokenHash,
    familyId: tokenRecord.familyId,
    expiresAt: newRefreshToken.expiresAt,
    isRevoked: false
  });

  return {
    accessToken: newAccessToken.token,
    refreshToken: newRefreshToken.token,
    tokenType: 'Bearer',
    accessTokenExpiresIn: newAccessToken.expiresIn,
    refreshTokenExpiresIn: newRefreshToken.expiresIn
  };
}

async function logout(payload) {
  const tokenString = validateTokenPayload(payload, 'refreshToken');

  try {
    const tokenHash = hashToken(tokenString);
    await authRepository.revokeRefreshToken(tokenHash);
  } catch (error) {
    // Idempotent logout: do not leak whether token existed or failed
  }
}

async function forgotPassword(payload) {
  if (!payload || !payload.email || typeof payload.email !== 'string') {
    throw new AppError('A valid email address is required', 400, 'VALIDATION_ERROR');
  }

  const user = await authRepository.findByEmail(payload.email);
  if (user && user.accountStatus === 'active') {
    // Generate secure 32-byte single-use random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    await authRepository.createPasswordReset({
      userId: user.id,
      tokenHash,
      expiresAt,
      isUsed: false
    });

    await emailService.sendPasswordResetEmail(user.email, rawToken);
  }

  // Idempotent generic message to prevent account enumeration
  return {
    message: 'If an active account exists for that email, a password reset link has been dispatched.'
  };
}

async function resetPassword(payload) {
  if (!payload || !payload.token || !payload.newPassword) {
    throw new AppError('Token and new password are required', 400, 'VALIDATION_ERROR');
  }

  if (typeof payload.newPassword !== 'string' || payload.newPassword.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400, 'VALIDATION_ERROR');
  }

  const tokenHash = hashToken(payload.token.trim());
  const resetRecord = await authRepository.findPasswordResetByHash(tokenHash);

  if (!resetRecord || resetRecord.isUsed || new Date(resetRecord.expiresAt) < new Date()) {
    throw new AppError('Password reset token is invalid, expired, or already used.', 400, 'INVALID_TOKEN');
  }

  const newHash = await hashPassword(payload.newPassword);
  await authRepository.updateUserPassword(resetRecord.userId, newHash);
  await authRepository.markPasswordResetUsed(resetRecord.id);

  return {
    message: 'Password has been successfully updated.'
  };
}

async function verifyEmail(payload) {
  if (!payload || !payload.token) {
    throw new AppError('Verification token is required', 400, 'VALIDATION_ERROR');
  }

  const tokenHash = hashToken(payload.token.trim());
  const record = await authRepository.findEmailVerificationByHash(tokenHash);

  if (!record || record.isUsed || new Date(record.expiresAt) < new Date()) {
    throw new AppError('Verification token is invalid, expired, or already used.', 400, 'INVALID_TOKEN');
  }

  await authRepository.markEmailVerified(record.id);

  return {
    message: 'Email address has been successfully verified.'
  };
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail
};
