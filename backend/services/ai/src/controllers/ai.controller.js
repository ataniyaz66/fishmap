const aiService = require('../services/ai.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  recommendLure: asyncHandler(async (req, res) => {
    const recommendation = await aiService.recommendLure(req.body);
    res.status(200).json({ data: recommendation });
  }),

  assist: asyncHandler(async (req, res) => {
    const assistance = await aiService.assist(req.body);
    res.status(200).json({ data: assistance });
  }),

  getStatus: asyncHandler(async (req, res) => {
    const status = await aiService.getStatus();
    res.status(200).json({ data: status });
  })
};
