const express = require('express');
const notificationsController = require('../controllers/notifications.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateUser);

router.get('/', notificationsController.listNotifications);
router.get('/unread-count', notificationsController.getUnreadCount);
router.patch('/:id/read', notificationsController.markAsRead);
router.post('/read-all', notificationsController.markAllAsRead);

module.exports = router;
