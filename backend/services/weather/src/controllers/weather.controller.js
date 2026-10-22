const weatherService = require('../services/weather.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  getCurrent: asyncHandler(async (req, res) => {
    const lat = req.query.lat || req.query.latitude;
    const lng = req.query.lng || req.query.longitude;
    const data = await weatherService.getCurrentWeather(lat, lng);
    res.status(200).json({ data });
  }),

  getForecast: asyncHandler(async (req, res) => {
    const lat = req.query.lat || req.query.latitude;
    const lng = req.query.lng || req.query.longitude;
    const days = req.query.days || 3;
    const data = await weatherService.getForecast(lat, lng, days);
    res.status(200).json({ data });
  })
};
