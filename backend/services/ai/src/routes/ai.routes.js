const express = require('express');
const aiController = require('../controllers/ai.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/status', aiController.getStatus);
router.post('/recommend-lure', optionalAuth, aiController.recommendLure);
router.post('/assist', optionalAuth, aiController.assist);

module.exports = router;
