const { Op } = require('sequelize');
const { FishingSpot, SpotFavorite, SpotReport } = require('../models');

function create(values) {
  return FishingSpot.create(values);
}

function findById(id) {
  return FishingSpot.findByPk(id);
}

function update(spot, values) {
  return spot.update(values);
}

function remove(spot) {
  return spot.destroy();
}

function findSpots(options = {}) {
  const {
    minLat,
    maxLat,
    minLng,
    maxLng,
    waterType,
    search,
    userId,
    requestingUserId,
    limit = 50,
    offset = 0
  } = options;

  const where = {};

  // Visibility rules: public spots OR owned by requesting user
  if (requestingUserId) {
    where[Op.or] = [
      { visibility: 'public' },
      { userId: requestingUserId }
    ];
  } else {
    where.visibility = 'public';
  }

  // Filter by owner
  if (userId) {
    where.userId = userId;
  }

  // Bounding box filter
  if (minLat !== undefined && maxLat !== undefined) {
    where.latitude = { [Op.between]: [Number(minLat), Number(maxLat)] };
  }
  if (minLng !== undefined && maxLng !== undefined) {
    where.longitude = { [Op.between]: [Number(minLng), Number(maxLng)] };
  }

  // Metadata filters
  if (waterType) {
    where.waterType = waterType;
  }
  if (search) {
    where.name = { [Op.iLike ? Op.iLike : Op.like]: `%${search}%` };
  }

  return FishingSpot.findAndCountAll({
    where,
    limit: Math.min(Math.max(Number(limit) || 50, 1), 100),
    offset: Math.max(Number(offset) || 0, 0),
    order: [['createdAt', 'DESC']]
  });
}

function addFavorite(userId, spotId) {
  return SpotFavorite.findOrCreate({
    where: { userId, spotId },
    defaults: { userId, spotId }
  });
}

function removeFavorite(userId, spotId) {
  return SpotFavorite.destroy({
    where: { userId, spotId }
  });
}

function isFavorite(userId, spotId) {
  return SpotFavorite.findOne({
    where: { userId, spotId }
  });
}

function findUserFavorites(userId, limit = 50, offset = 0) {
  return SpotFavorite.findAll({
    where: { userId },
    include: [{ model: FishingSpot, as: 'spot' }],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
}

function createReport(data) {
  return SpotReport.create(data);
}

module.exports = {
  create,
  findById,
  update,
  remove,
  findSpots,
  addFavorite,
  removeFavorite,
  isFavorite,
  findUserFavorites,
  createReport
};
