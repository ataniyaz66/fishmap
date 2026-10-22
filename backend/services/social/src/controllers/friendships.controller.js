const friendshipsService = require('../services/friendships.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  sendRequest: asyncHandler(async (req, res) => {
    const requesterId = req.user ? req.user.id : req.body.user_id;
    const addresseeId = req.body.addressee_id || req.body.addresseeId;
    const friendship = await friendshipsService.sendFriendRequest(requesterId, addresseeId);
    res.status(201).json({ data: friendship });
  }),

  acceptRequest: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const friendshipId = req.params.id || req.body.friendship_id;
    const friendship = await friendshipsService.acceptFriendRequest(userId, friendshipId);
    res.status(200).json({ data: friendship });
  }),

  declineRequest: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const friendshipId = req.params.id || req.body.friendship_id;
    const friendship = await friendshipsService.declineFriendRequest(userId, friendshipId);
    res.status(200).json({ data: friendship });
  }),

  blockUser: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const targetUserId = req.body.target_user_id || req.body.targetUserId;
    const friendship = await friendshipsService.blockUser(userId, targetUserId);
    res.status(200).json({ data: friendship });
  }),

  listFriends: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.query.user_id || req.query.userId);
    const result = await friendshipsService.listFriends(userId);
    res.status(200).json({ data: result.friends, total: result.total });
  }),

  listPendingRequests: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.query.user_id || req.query.userId);
    const type = req.query.type || 'received';
    const result = await friendshipsService.listPendingRequests(userId, type);
    res.status(200).json({ data: result.requests, total: result.total });
  }),

  getFriendshipStatus: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const targetUserId = req.params.targetUserId;
    const result = await friendshipsService.getFriendshipStatus(userId, targetUserId);
    res.status(200).json({ data: result });
  }),

  removeFriend: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const targetId = req.params.targetId;
    await friendshipsService.removeFriendOrRequest(userId, targetId);
    res.status(204).end();
  })
};
