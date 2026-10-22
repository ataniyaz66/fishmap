const express = require('express');
const inventoryController = require('../controllers/inventory.controller');
const { authenticateUser, optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/items')
  .get(optionalAuth, inventoryController.listItems)
  .post(authenticateUser, inventoryController.createItem);

router.route('/items/:id')
  .get(optionalAuth, inventoryController.getItem)
  .patch(authenticateUser, inventoryController.updateItem)
  .delete(authenticateUser, inventoryController.deleteItem);

module.exports = router;
