function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: statusCode === 404 ? error.message : 'Internal server error'
    }
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
