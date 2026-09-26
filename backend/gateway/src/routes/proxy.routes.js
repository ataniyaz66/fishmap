const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {
  authServiceUrl,
  usersServiceUrl,
  fishingServiceUrl,
  inventoryServiceUrl
} = require('../config/env');

const router = express.Router();

function createServiceProxy(serviceUrl, routePrefix) {
  return createProxyMiddleware({
    target: serviceUrl,
    changeOrigin: true,
    pathRewrite: (path) => `${routePrefix}${path}`
  });
}

router.use(
  '/api/v1/auth',
  createServiceProxy(authServiceUrl, '/api/v1/auth')
);

router.use(
  '/api/v1/users',
  createServiceProxy(usersServiceUrl, '/api/v1/users')
);

router.use(
  '/api/v1/fishing',
  createServiceProxy(fishingServiceUrl, '/api/v1/fishing')
);

router.use(
  '/api/v1/inventory',
  createServiceProxy(inventoryServiceUrl, '/api/v1/inventory')
);

module.exports = router;