const { verifyAccessToken } = require('../utils/token');
const AppError = require('../utils/app-error');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return next(new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED'));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return next(new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED'));
  }

  const token = parts[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role || 'user'
    };
    next();
  } catch (error) {
    next(error);
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('A required access token is missing, invalid, or expired.', 401, 'UNAUTHORIZED'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN'));
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
