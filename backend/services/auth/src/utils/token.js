const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const AppError = require('./app-error');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function parseExpiresInSeconds(val, defaultSeconds) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    if (val.endsWith('s')) return parseInt(val, 10);
    if (val.endsWith('m')) return parseInt(val, 10) * 60;
    if (val.endsWith('h')) return parseInt(val, 10) * 3600;
    if (val.endsWith('d')) return parseInt(val, 10) * 86400;
  }
  return defaultSeconds;
}

function generateAccessToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    username: user.username,
    role: user.role || 'user',
    type: 'access'
  };

  const token = jwt.sign(payload, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpiresIn
  });

  const expiresIn = parseExpiresInSeconds(config.jwtAccessExpiresIn, 900);
  return { token, expiresIn };
}

function generateRefreshToken(user, familyId = null) {
  const jti = crypto.randomUUID();
  const tokenFamilyId = familyId || crypto.randomUUID();

  const payload = {
    sub: user.id,
    jti,
    familyId: tokenFamilyId,
    purpose: 'refresh',
    type: 'refresh'
  };

  const token = jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn
  });

  const expiresIn = parseExpiresInSeconds(config.jwtRefreshExpiresIn, 2592000);
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  return {
    token,
    jti,
    familyId: tokenFamilyId,
    expiresIn,
    expiresAt,
    tokenHash: hashToken(token)
  };
}

function verifyAccessToken(token) {
  try {
    const payload = jwt.verify(token, config.jwtAccessSecret);
    if (payload.type !== 'access') {
      throw new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED');
    }
    return payload;
  } catch (error) {
    throw new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED');
  }
}

function verifyRefreshToken(token) {
  try {
    const payload = jwt.verify(token, config.jwtRefreshSecret);
    if (payload.type !== 'refresh' || payload.purpose !== 'refresh') {
      throw new AppError('The refresh token is invalid, expired, revoked, or has the wrong purpose.', 401, 'INVALID_REFRESH_TOKEN');
    }
    return payload;
  } catch (error) {
    throw new AppError('The refresh token is invalid, expired, revoked, or has the wrong purpose.', 401, 'INVALID_REFRESH_TOKEN');
  }
}

module.exports = {
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
