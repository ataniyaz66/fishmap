const express = require('express');
const inventoryController = require('../controllers/inventory.controller');

const router = express.Router();

router.route('/items')
  .get(inventoryController.listItems)
  .post(inventoryController.createItem);
router.route('/items/:id')
  .get(inventoryController.getItem)
  .patch(inventoryController.updateItem)
  .delete(inventoryController.deleteItem);

module.exports = router;
