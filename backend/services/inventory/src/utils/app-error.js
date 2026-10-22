function defaultCode(statusCode) {
  switch (statusCode) {
    case 400: return 'VALIDATION_ERROR';
    case 401: return 'UNAUTHORIZED';
    case 403: return 'FORBIDDEN';
    case 404: return 'NOT_FOUND';
    case 409: return 'CONFLICT';
    case 501: return 'NOT_IMPLEMENTED';
    default: return 'INTERNAL_ERROR';
  }
}

class AppError extends Error {
  constructor(message, statusCode = 500, code = null, details = []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code || defaultCode(statusCode);
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
