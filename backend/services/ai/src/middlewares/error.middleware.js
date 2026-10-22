const AppError = require('../utils/app-error');

function notFoundHandler(req, res, next) {
  next(new AppError(`Resource not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
}

function errorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload in request body',
        details: []
      }
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      details: err.details || []
    }
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
