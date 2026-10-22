const express = require('express');
const weatherController = require('../controllers/weather.controller');

const router = express.Router();

router.get('/current', weatherController.getCurrent);
router.get('/forecast', weatherController.getForecast);

module.exports = router;
