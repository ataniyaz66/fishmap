const spotsService = require('../services/spots.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  create: asyncHandler(async (req, res) => {
    const spot = await spotsService.create(req.body);
    res.status(201).json({ data: spot });
  }),
  list: asyncHandler(async (req, res) => {
    const spots = await spotsService.list();
    res.status(200).json({ data: spots });
  }),
  getById: asyncHandler(async (req, res) => {
    const spot = await spotsService.getById(req.params.id);
    res.status(200).json({ data: spot });
  }),
  update: asyncHandler(async (req, res) => {
    const spot = await spotsService.update(req.params.id, req.body);
    res.status(200).json({ data: spot });
  }),
  remove: asyncHandler(async (req, res) => {
    await spotsService.remove(req.params.id);
    res.status(204).end();
  })
};
