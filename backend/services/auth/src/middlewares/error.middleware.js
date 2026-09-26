const AppError = require('../utils/app-error');

function notFoundHandler(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} was not found.`, 404, 'NOT_FOUND'));
}

function errorHandler(error, req, res, next) {
  const isMalformedJson = error instanceof SyntaxError && error.status === 400 && 'body' in error;
  const normalizedError = isMalformedJson
    ? new AppError('Request body contains invalid JSON.', 400, 'INVALID_JSON')
    : error;
  const statusCode = normalizedError.statusCode || 500;
  const code = normalizedError.code || 'INTERNAL_SERVER_ERROR';
  const isUnexpectedError = statusCode >= 500 && statusCode !== 501;
  const message = isUnexpectedError ? 'An unexpected error occurred.' : normalizedError.message;

  if (isUnexpectedError) {
    console.error(normalizedError);
  }

  res.status(statusCode).json({ status: 'error', code, message });
}

module.exports = { notFoundHandler, errorHandler };
