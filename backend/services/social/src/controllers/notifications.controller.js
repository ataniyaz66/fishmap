const notificationsService = require('../services/notifications.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  listNotifications: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.query.user_id || req.query.userId);
    const limit = Math.min(Number(req.query.limit) || 30, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const result = await notificationsService.listNotifications(userId, limit, offset);
    res.status(200).json(result);
  }),

  getUnreadCount: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.query.user_id || req.query.userId);
    const result = await notificationsService.getUnreadCount(userId);
    res.status(200).json({ data: result });
  }),

  markAsRead: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.query.user_id || req.body.user_id);
    const notification = await notificationsService.markAsRead(req.params.id, userId);
    res.status(200).json({ data: notification });
  }),

  markAllAsRead: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.query.user_id || req.body.user_id);
    const result = await notificationsService.markAllAsRead(userId);
    res.status(200).json({ data: result });
  })
};
