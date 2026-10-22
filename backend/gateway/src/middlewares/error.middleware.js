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

  const statusCode = error.statusCode || 500;
  const is404 = statusCode === 404;
  const code = error.code || (is404 ? 'NOT_FOUND' : 'INTERNAL_ERROR');
  const message = is404 ? error.message : (statusCode >= 500 ? 'Internal server error' : error.message);

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
