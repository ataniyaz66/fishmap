const jwt = require('jsonwebtoken');
const AppError = require('../utils/app-error');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'fishmap-default-dev-jwt-access-secret-32b';

function authenticateUser(req, res, next) {
  // 1. Check Gateway forwarded header
  const gatewayUserId = req.headers['x-user-id'];
  if (gatewayUserId && typeof gatewayUserId === 'string' && gatewayUserId.trim()) {
    req.user = {
      id: gatewayUserId.trim(),
      role: req.headers['x-user-role'] || 'user'
    };
    return next();
  }

  // 2. Check Bearer Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return next(new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED'));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return next(new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED'));
  }

  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    if (payload.type !== 'access') {
      return next(new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED'));
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role || 'user'
    };
    next();
  } catch (err) {
    return next(new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED'));
  }
}

// Optional authentication: extracts user if token provided, but doesn't throw if omitted
function optionalAuth(req, res, next) {
  const gatewayUserId = req.headers['x-user-id'];
  if (gatewayUserId) {
    req.user = { id: gatewayUserId.trim(), role: req.headers['x-user-role'] || 'user' };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
      if (payload.type === 'access') {
        req.user = { id: payload.sub, email: payload.email, username: payload.username, role: payload.role || 'user' };
      }
    } catch (_) {
      // Ignored for optional auth
    }
  }
  next();
}

module.exports = {
  authenticateUser,
  optionalAuth
};
