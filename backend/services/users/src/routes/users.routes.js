const express = require('express');
const usersController = require('../controllers/users.controller');
const { authenticateUser, optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/me', authenticateUser, usersController.getMyProfile);
router.patch('/me', authenticateUser, usersController.updateMyProfile);

router.get('/', optionalAuth, usersController.listProfiles);
router.get('/:id', optionalAuth, usersController.getProfileById);

module.exports = router;
