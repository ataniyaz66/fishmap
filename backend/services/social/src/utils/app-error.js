class AppError extends Error {
  constructor(message, statusCode = 500, code = null, details = []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 403 ? 'FORBIDDEN' : statusCode === 409 ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR');
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
