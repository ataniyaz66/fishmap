const inventoryService = require('../services/inventory.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  createItem: asyncHandler(async (req, res) => {
    const item = await inventoryService.createItem(req.body);
    res.status(201).json({ data: item });
  }),
  listItems: asyncHandler(async (req, res) => {
    const items = await inventoryService.listItems(req.query.user_id);
    res.status(200).json({ data: items });
  }),
  getItem: asyncHandler(async (req, res) => {
    const item = await inventoryService.getItem(req.params.id, req.query.user_id);
    res.status(200).json({ data: item });
  }),
  updateItem: asyncHandler(async (req, res) => {
    const item = await inventoryService.updateItem(
      req.params.id,
      req.query.user_id,
      req.body
    );
    res.status(200).json({ data: item });
  }),
  deleteItem: asyncHandler(async (req, res) => {
    await inventoryService.deleteItem(req.params.id, req.query.user_id);
    res.status(204).end();
  })
};
