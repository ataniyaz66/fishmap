const express = require('express');
const spotsController = require('../controllers/spots.controller');

const router = express.Router();

router.route('/')
  .post(spotsController.create)
  .get(spotsController.list);
router.route('/:id')
  .get(spotsController.getById)
  .patch(spotsController.update)
  .delete(spotsController.remove);

module.exports = router;
