const express = require('express');
const catchesController = require('../controllers/catches.controller');

const router = express.Router();

router.route('/spots/:spotId/catches')
  .post(catchesController.create)
  .get(catchesController.listBySpotId);
router.route('/catches/:id')
  .get(catchesController.getById)
  .patch(catchesController.update)
  .delete(catchesController.remove);

module.exports = router;
