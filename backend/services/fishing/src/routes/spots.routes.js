const express = require('express');
const spotsController = require('../controllers/spots.controller');
const { authenticateUser, optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/favorites', authenticateUser, spotsController.listFavorites);

router.route('/')
  .post(authenticateUser, spotsController.create)
  .get(optionalAuth, spotsController.list);

router.route('/:id')
  .get(optionalAuth, spotsController.getById)
  .patch(authenticateUser, spotsController.update)
  .delete(authenticateUser, spotsController.remove);

router.post('/:id/favorite', authenticateUser, spotsController.favorite);
router.delete('/:id/favorite', authenticateUser, spotsController.unfavorite);
router.post('/:id/report', authenticateUser, spotsController.report);

module.exports = router;
