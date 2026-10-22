const express = require('express');
const friendshipsController = require('../controllers/friendships.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateUser);

router.post('/request', friendshipsController.sendRequest);
router.post('/accept/:id', friendshipsController.acceptRequest);
router.post('/decline/:id', friendshipsController.declineRequest);
router.post('/block', friendshipsController.blockUser);
router.get('/', friendshipsController.listFriends);
router.get('/requests', friendshipsController.listPendingRequests);
router.get('/status/:targetUserId', friendshipsController.getFriendshipStatus);
router.delete('/:targetId', friendshipsController.removeFriend);

module.exports = router;
