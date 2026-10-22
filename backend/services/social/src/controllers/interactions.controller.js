const interactionsService = require('../services/interactions.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  toggleLike: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const result = await interactionsService.toggleLike(req.params.id, userId);
    res.status(200).json({ data: result });
  }),

  addComment: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const comment = await interactionsService.addComment(req.params.id, userId, req.body.content);
    res.status(201).json({ data: comment });
  }),

  listComments: asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const result = await interactionsService.listComments(req.params.id, limit, offset);
    res.status(200).json({ data: result.rows, total: result.count });
  }),

  deleteComment: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.body ? req.body.user_id : null);
    await interactionsService.deleteComment(req.params.commentId, userId);
    res.status(204).end();
  })
};
