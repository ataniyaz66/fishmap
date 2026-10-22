const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateUser);

router.get('/user', analyticsController.getUserAnalytics);

module.exports = router;
