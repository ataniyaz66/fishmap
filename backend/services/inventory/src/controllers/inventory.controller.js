const inventoryService = require('../services/inventory.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  createItem: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.body.user_id || req.body.userId);
    const item = await inventoryService.createItem(userId, req.body);
    res.status(201).json({ data: item });
  }),

  listItems: asyncHandler(async (req, res) => {
    const requestingUserId = req.user ? req.user.id : null;
    const targetUserId = req.query.user_id || req.query.userId || requestingUserId;
    const items = await inventoryService.listItems(targetUserId, requestingUserId, req.query);
    res.status(200).json({ data: items });
  }),

  getItem: asyncHandler(async (req, res) => {
    const requestingUserId = req.user ? req.user.id : (req.query.user_id || req.query.userId);
    const item = await inventoryService.getItem(req.params.id, requestingUserId);
    res.status(200).json({ data: item });
  }),

  updateItem: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.query.user_id || req.query.userId || req.body.user_id || req.body.userId);
    const item = await inventoryService.updateItem(
      req.params.id,
      userId,
      req.body
    );
    res.status(200).json({ data: item });
  }),

  deleteItem: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.query.user_id || req.query.userId || req.body.user_id || req.body.userId);
    await inventoryService.deleteItem(req.params.id, userId);
    res.status(204).end();
  })
};
