class AppError extends Error {
  constructor(message, statusCode = 500, code = null, details = []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 400 ? 'VALIDATION_ERROR' : statusCode === 401 ? 'UNAUTHORIZED' : 'INTERNAL_SERVER_ERROR');
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
