const spotsService = require('../services/spots.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  create: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const spot = await spotsService.create(userId, req.body);
    res.status(201).json({ data: spot });
  }),

  list: asyncHandler(async (req, res) => {
    const requestingUserId = req.user ? req.user.id : null;
    const spots = await spotsService.list(req.query, requestingUserId);
    res.status(200).json(spots);
  }),

  getById: asyncHandler(async (req, res) => {
    const requestingUserId = req.user ? req.user.id : null;
    const spot = await spotsService.getById(req.params.id, requestingUserId);
    res.status(200).json({ data: spot });
  }),

  update: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const spot = await spotsService.update(req.params.id, userId, req.body);
    res.status(200).json({ data: spot });
  }),

  remove: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.body ? req.body.user_id : null);
    await spotsService.remove(req.params.id, userId);
    res.status(204).end();
  }),

  favorite: asyncHandler(async (req, res) => {
    const result = await spotsService.toggleFavorite(req.user.id, req.params.id, true);
    res.status(200).json({ data: result });
  }),

  unfavorite: asyncHandler(async (req, res) => {
    const result = await spotsService.toggleFavorite(req.user.id, req.params.id, false);
    res.status(200).json({ data: result });
  }),

  listFavorites: asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const favorites = await spotsService.listFavorites(req.user.id, limit, offset);
    res.status(200).json({ data: favorites });
  }),

  report: asyncHandler(async (req, res) => {
    const report = await spotsService.reportSpot(req.user.id, req.params.id, req.body);
    res.status(201).json({ data: report });
  })
};
