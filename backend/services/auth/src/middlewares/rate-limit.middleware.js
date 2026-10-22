const AppError = require('../utils/app-error');

function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
  const max = options.max || 100; // 100 requests per window by default
  const message = options.message || 'Too many requests, please try again later.';
  const hits = new Map();

  // Periodically clean up old entries to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(key);
      }
    }
  }, Math.max(windowMs, 60000));

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return function rateLimitMiddleware(req, res, next) {
    // Skip if disabled (e.g. in test environment if configured)
    if (process.env.DISABLE_RATE_LIMIT === 'true') {
      return next();
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const key = `${req.baseUrl || ''}${req.path}:${ip}`;
    const now = Date.now();

    let record = hits.get(key);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      hits.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      res.setHeader('Retry-After', retryAfter);
      return next(new AppError(message, 429, 'TOO_MANY_REQUESTS'));
    }

    next();
  };
}

module.exports = {
  createRateLimiter,
  authRateLimiter: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: 'Too many authentication attempts. Please try again later.'
  })
};
