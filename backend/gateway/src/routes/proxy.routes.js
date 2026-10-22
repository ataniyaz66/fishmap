const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {
  authServiceUrl,
  usersServiceUrl,
  fishingServiceUrl,
  inventoryServiceUrl,
  socialServiceUrl,
  chatServiceUrl,
  weatherServiceUrl,
  aiServiceUrl
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

router.use(
  '/api/v1/social',
  createServiceProxy(socialServiceUrl, '/api/v1/social')
);

router.use(
  '/api/v1/chat',
  createServiceProxy(chatServiceUrl, '/api/v1/chat')
);

router.use(
  '/api/v1/weather',
  createServiceProxy(weatherServiceUrl, '/api/v1/weather')
);

router.use(
  '/api/v1/ai',
  createServiceProxy(aiServiceUrl, '/api/v1/ai')
);

module.exports = router;
