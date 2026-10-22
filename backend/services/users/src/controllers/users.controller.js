const usersService = require('../services/users.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  getMyProfile: asyncHandler(async (req, res) => {
    const profile = await usersService.getOrCreateProfile(req.user.id);
    res.status(200).json({ data: profile });
  }),

  updateMyProfile: asyncHandler(async (req, res) => {
    const updated = await usersService.updateProfile(req.user.id, req.body);
    res.status(200).json({ data: updated });
  }),

  getProfileById: asyncHandler(async (req, res) => {
    const requestingUserId = req.user ? req.user.id : null;
    const profile = await usersService.getProfileById(req.params.id, requestingUserId);
    res.status(200).json({ data: profile });
  }),

  listProfiles: asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const search = req.query.search || req.query.q || null;
    const result = await usersService.listPublicProfiles(limit, offset, search);
    res.status(200).json({
      data: result.rows,
      total: result.count,
      limit,
      offset
    });
  })
};
