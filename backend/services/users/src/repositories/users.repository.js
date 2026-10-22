const { Op } = require('sequelize');
const { UserProfile } = require('../models');

function findByAuthUserId(authUserId) {
  if (!authUserId) return null;
  return UserProfile.findOne({
    where: { authUserId }
  });
}

function findById(id) {
  if (!id) return null;
  return UserProfile.findByPk(id);
}

function create(data) {
  return UserProfile.create(data);
}

function update(profile, data) {
  return profile.update(data);
}

function findPublicProfiles(limit = 20, offset = 0, search = null) {
  const where = { isPublic: true };
  if (search && typeof search === 'string' && search.trim().length > 0) {
    where.displayName = { [Op.iLike]: `%${search.trim()}%` };
  }
  return UserProfile.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
}

module.exports = {
  findByAuthUserId,
  findById,
  create,
  update,
  findPublicProfiles
};
