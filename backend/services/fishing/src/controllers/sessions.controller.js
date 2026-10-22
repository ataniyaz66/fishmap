const sessionsService = require('../services/sessions.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  create: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const session = await sessionsService.createSession(userId, req.body);
    res.status(201).json({ data: session });
  }),

  list: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.query.user_id;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const sessions = await sessionsService.listSessions(userId, limit, offset);
    res.status(200).json({ data: sessions });
  }),

  getById: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.query.user_id;
    const session = await sessionsService.getSessionById(req.params.id, userId);
    res.status(200).json({ data: session });
  }),

  update: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const session = await sessionsService.updateSession(req.params.id, userId, req.body);
    res.status(200).json({ data: session });
  }),

  remove: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.body ? req.body.user_id : null);
    await sessionsService.deleteSession(req.params.id, userId);
    res.status(204).end();
  })
};
