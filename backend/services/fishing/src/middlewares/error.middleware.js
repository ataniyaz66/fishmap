const {
  ForeignKeyConstraintError,
  ValidationError,
  UniqueConstraintError
} = require('sequelize');

function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: {
        message: 'Invalid JSON body'
      }
    });
  }

  if (
    error instanceof ValidationError ||
    error instanceof UniqueConstraintError ||
    error instanceof ForeignKeyConstraintError
  ) {
    return res.status(400).json({
      error: {
        message: error.message
      }
    });
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: statusCode >= 500 ? 'Internal server error' : error.message
    }
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
