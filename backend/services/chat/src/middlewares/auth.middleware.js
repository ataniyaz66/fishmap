const jwt = require('jsonwebtoken');
const AppError = require('../utils/app-error');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'fishmap-default-dev-jwt-access-secret-32b';

function authenticateUser(req, res, next) {
  // 1. Gateway header
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

  // 3. Fallback for test mode
  const fallbackUserId = req.body?.user_id || req.query?.user_id;
  if ((process.env.ALLOW_MOCK_USER_ID === 'true' || process.env.NODE_ENV === 'test') && fallbackUserId) {
    req.user = { id: fallbackUserId, role: 'user' };
    return next();
  }

  return next(new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED'));
}

module.exports = {
  authenticateUser
};
