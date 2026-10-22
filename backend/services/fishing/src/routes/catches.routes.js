const express = require('express');
const catchesController = require('../controllers/catches.controller');
const { authenticateUser, optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/spots/:spotId/catches')
  .post(authenticateUser, catchesController.create)
  .get(optionalAuth, catchesController.listBySpotId);

router.route('/catches')
  .post(authenticateUser, catchesController.create)
  .get(optionalAuth, catchesController.listAll);

router.route('/catches/:id')
  .get(optionalAuth, catchesController.getById)
  .patch(authenticateUser, catchesController.update)
  .delete(authenticateUser, catchesController.remove);

module.exports = router;
