const AppError = require('../utils/app-error');
const { ValidationError, UniqueConstraintError } = require('sequelize');

function notFoundHandler(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} was not found.`, 404, 'NOT_FOUND'));
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const isMalformedJson = error instanceof SyntaxError && error.status === 400 && 'body' in error;
  if (isMalformedJson) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body contains invalid JSON.',
        details: []
      }
    });
  }

  if (error instanceof UniqueConstraintError) {
    const details = (error.errors || []).map((err) => ({
      field: err.path,
      message: err.message
    }));
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: error.message || 'Resource conflict occurred.',
        details
      }
    });
  }

  if (error instanceof ValidationError) {
    const details = (error.errors || []).map((err) => ({
      field: err.path,
      message: err.message
    }));
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details
      }
    });
  }

  const statusCode = error.statusCode || 500;
  const code = error.code || (statusCode >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST');
  const isUnexpectedError = statusCode >= 500 && statusCode !== 501;
  const message = isUnexpectedError ? 'An unexpected error occurred.' : (error.message || 'Error occurred.');

  if (isUnexpectedError) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      details: error.details || []
    }
  });
}

module.exports = { notFoundHandler, errorHandler };
