const AppError = require('./app-error');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[A-Za-z0-9_]{3,30}$/;

function validateRegistration(body) {
  const details = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('Request body must be a JSON object', 400, 'VALIDATION_ERROR');
  }

  const { email, username, password } = body;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    details.push({
      field: 'email',
      message: 'Email must be a valid email address'
    });
  } else if (email.length > 320) {
    details.push({
      field: 'email',
      message: 'Email must not exceed 320 characters'
    });
  }

  if (!username || typeof username !== 'string' || !USERNAME_REGEX.test(username.trim())) {
    details.push({
      field: 'username',
      message: 'Username must be 3-30 alphanumeric characters or underscores'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    details.push({
      field: 'password',
      message: 'Password must be at least 8 characters'
    });
  }

  if (details.length > 0) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', details);
  }

  return {
    email: email.trim().toLowerCase(),
    username: username.trim(),
    password
  };
}

function validateLogin(body) {
  const details = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('Request body must be a JSON object', 400, 'VALIDATION_ERROR');
  }

  const { email, username, password } = body;

  if (!email && !username) {
    details.push({
      field: 'identifier',
      message: 'Either email or username is required'
    });
  } else if (email && username) {
    details.push({
      field: 'identifier',
      message: 'Provide either email or username, not both'
    });
  }

  if (email && (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()))) {
    details.push({
      field: 'email',
      message: 'Email must be a valid email address'
    });
  }

  if (username && (typeof username !== 'string' || username.trim().length === 0)) {
    details.push({
      field: 'username',
      message: 'Username must not be empty'
    });
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    details.push({
      field: 'password',
      message: 'Password is required'
    });
  }

  if (details.length > 0) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', details);
  }

  return {
    email: email ? email.trim().toLowerCase() : undefined,
    username: username ? username.trim() : undefined,
    password
  };
}

function validateTokenPayload(body, fieldName = 'refreshToken') {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('Request body must be a JSON object', 400, 'VALIDATION_ERROR');
  }

  const token = body[fieldName];
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', [
      {
        field: fieldName,
        message: `${fieldName} is required`
      }
    ]);
  }

  return token.trim();
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateTokenPayload
};
