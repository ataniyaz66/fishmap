const {
  ForeignKeyConstraintError,
  ValidationError,
  UniqueConstraintError
} = require('sequelize');

function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  next(error);
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Invalid JSON body',
        details: []
      }
    });
  }

  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: error.message,
        details: (error.errors || []).map((e) => ({ field: e.path, message: e.message }))
      }
    });
  }

  if (
    error instanceof ValidationError ||
    error instanceof ForeignKeyConstraintError
  ) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: (error.errors || []).map((e) => ({ field: e.path, message: e.message }))
      }
    });
  }

  const statusCode = error.statusCode || 500;
  const isInternal = statusCode >= 500 && statusCode !== 501;
  const code = error.code || (isInternal ? 'INTERNAL_ERROR' : 'BAD_REQUEST');
  const message = isInternal ? 'Internal server error' : (error.message || 'Error occurred');

  if (isInternal) {
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

module.exports = {
  notFoundHandler,
  errorHandler
};
