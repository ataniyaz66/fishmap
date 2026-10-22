const analyticsService = require('../services/analytics.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  getUserAnalytics: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.query.user_id;
    const analytics = await analyticsService.getUserAnalytics(userId);
    res.status(200).json({ data: analytics });
  })
};
