const catchesService = require('../services/catches.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  create: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const spotId = req.params.spotId || req.body.spot_id;
    const caughtFish = await catchesService.create(userId, req.body, spotId);
    res.status(201).json({ data: caughtFish });
  }),

  listBySpotId: asyncHandler(async (req, res) => {
    const requestingUserId = req.user ? req.user.id : null;
    const catches = await catchesService.listBySpotId(req.params.spotId, requestingUserId);
    res.status(200).json({ data: catches });
  }),

  listAll: asyncHandler(async (req, res) => {
    const requestingUserId = req.user ? req.user.id : null;
    const result = await catchesService.listCatches(req.query, requestingUserId);
    res.status(200).json({
      data: result.rows,
      total: result.count
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const requestingUserId = req.user ? req.user.id : null;
    const caughtFish = await catchesService.getById(req.params.id, requestingUserId);
    res.status(200).json({ data: caughtFish });
  }),

  update: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const caughtFish = await catchesService.update(req.params.id, userId, req.body);
    res.status(200).json({ data: caughtFish });
  }),

  remove: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.body ? req.body.user_id : null);
    await catchesService.remove(req.params.id, userId);
    res.status(204).end();
  })
};
