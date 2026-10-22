const jwt = require('jsonwebtoken');
const AppError = require('../utils/app-error');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'fishmap-default-dev-jwt-access-secret-32b';

function authenticateUser(req, res, next) {
  // 1. Gateway forwarded header
  const gatewayUserId = req.headers['x-user-id'];
  if (gatewayUserId && typeof gatewayUserId === 'string' && gatewayUserId.trim()) {
    req.user = {
      id: gatewayUserId.trim(),
      role: req.headers['x-user-role'] || 'user'
    };
    return next();
  }

  // 2. Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === 'string') {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      try {
        const payload = jwt.verify(parts[1], JWT_SECRET);
        if (payload.type === 'access') {
          req.user = {
            id: payload.sub,
            email: payload.email,
            username: payload.username,
            role: payload.role || 'user'
          };
          return next();
        }
      } catch (err) {
        return next(new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED'));
      }
    }
  }

  // 3. Fallback for backwards compatibility if explicit mock header/flag is set
  if (process.env.ALLOW_MOCK_USER_ID === 'true' && req.body && req.body.user_id) {
    req.user = { id: req.body.user_id, role: 'user' };
    return next();
  }

  return next(new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED'));
}

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

  if (!req.user && process.env.ALLOW_MOCK_USER_ID === 'true' && req.query && req.query.user_id) {
    req.user = { id: req.query.user_id, role: 'user' };
  }

  next();
}

module.exports = {
  authenticateUser,
  optionalAuth
};
