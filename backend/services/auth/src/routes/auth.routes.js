const express = require('express');
const authController = require('../controllers/auth.controller');
const { authRateLimiter } = require('../middlewares/rate-limit.middleware');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);
router.post('/refresh', authRateLimiter, authController.refresh);
router.post('/logout', authController.logout);

// Account recovery & email verification
router.post('/forgot-password', authRateLimiter, authController.forgotPassword);
router.post('/reset-password', authRateLimiter, authController.resetPassword);
router.post('/verify-email', authRateLimiter, authController.verifyEmail);

// Protected endpoint to verify authenticated identity
router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

module.exports = router;
