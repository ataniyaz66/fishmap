const { Op } = require('sequelize');
const { Catch, FishingSpot, FishingSession } = require('../models');

function create(values) {
  return Catch.create(values);
}

function findById(id) {
  return Catch.findByPk(id, {
    include: [
      { model: FishingSpot, as: 'spot' },
      { model: FishingSession, as: 'session' }
    ]
  });
}

function findBySpotId(spotId, options = {}) {
  const where = { spotId };
  if (options.requestingUserId) {
    where[Op.or] = [
      { visibility: 'public' },
      { userId: options.requestingUserId }
    ];
  } else {
    where.visibility = 'public';
  }

  return Catch.findAll({
    where,
    order: [['caughtAt', 'DESC']],
    limit: options.limit || 50,
    offset: options.offset || 0
  });
}

function findCatches(options = {}) {
  const {
    userId,
    spotId,
    sessionId,
    species,
    startDate,
    endDate,
    requestingUserId,
    limit = 50,
    offset = 0
  } = options;

  const where = {};

  if (userId) {
    where.userId = userId;
  }

  if (spotId) {
    where.spotId = spotId;
  }

  if (sessionId) {
    where.sessionId = sessionId;
  }

  if (species) {
    where.species = { [Op.iLike ? Op.iLike : Op.like]: `%${species}%` };
  }

  if (startDate || endDate) {
    where.caughtAt = {};
    if (startDate) where.caughtAt[Op.gte] = new Date(startDate);
    if (endDate) where.caughtAt[Op.lte] = new Date(endDate);
  }

  // Visibility check
  if (requestingUserId) {
    if (!userId || userId !== requestingUserId) {
      where[Op.or] = [
        { visibility: 'public' },
        { userId: requestingUserId }
      ];
    }
  } else {
    where.visibility = 'public';
  }

  return Catch.findAndCountAll({
    where,
    limit: Math.min(Math.max(Number(limit) || 50, 1), 100),
    offset: Math.max(Number(offset) || 0, 0),
    order: [['caughtAt', 'DESC']]
  });
}

function update(caughtFish, values) {
  return caughtFish.update(values);
}

function remove(caughtFish) {
  return caughtFish.destroy();
}

module.exports = {
  create,
  findById,
  findBySpotId,
  findCatches,
  update,
  remove
};
