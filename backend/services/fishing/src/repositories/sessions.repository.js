const { FishingSession, Catch } = require('../models');

function create(data) {
  return FishingSession.create(data);
}

function findById(id) {
  return FishingSession.findByPk(id, {
    include: [{ model: Catch, as: 'catches' }]
  });
}

function findByUserId(userId, limit = 50, offset = 0) {
  return FishingSession.findAll({
    where: { userId },
    include: [{ model: Catch, as: 'catches' }],
    limit,
    offset,
    order: [['startedAt', 'DESC']]
  });
}

function update(session, data) {
  return session.update(data);
}

function remove(session) {
  return session.destroy();
}

module.exports = {
  create,
  findById,
  findByUserId,
  update,
  remove
};
