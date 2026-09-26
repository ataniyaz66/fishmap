const catchesService = require('../services/catches.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  create: asyncHandler(async (req, res) => {
    const caughtFish = await catchesService.create(req.params.spotId, req.body);
    res.status(201).json({ data: caughtFish });
  }),
  listBySpotId: asyncHandler(async (req, res) => {
    const catches = await catchesService.listBySpotId(req.params.spotId);
    res.status(200).json({ data: catches });
  }),
  getById: asyncHandler(async (req, res) => {
    const caughtFish = await catchesService.getById(req.params.id);
    res.status(200).json({ data: caughtFish });
  }),
  update: asyncHandler(async (req, res) => {
    const caughtFish = await catchesService.update(req.params.id, req.body);
    res.status(200).json({ data: caughtFish });
  }),
  remove: asyncHandler(async (req, res) => {
    await catchesService.remove(req.params.id);
    res.status(204).end();
  })
};
