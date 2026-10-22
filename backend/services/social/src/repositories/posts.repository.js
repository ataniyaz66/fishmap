const { Post, Comment, Like } = require('../models');
const { Op } = require('sequelize');

function create(data) {
  return Post.create(data);
}

function findById(id) {
  return Post.findByPk(id, {
    include: [
      { model: Comment, as: 'comments' },
      { model: Like, as: 'likes' }
    ]
  });
}

function findFeed(allowedUserIds = [], allowedVisibilities = ['public'], limit = 20, offset = 0) {
  const whereConditions = [];

  // Public posts always allowed
  if (allowedVisibilities.includes('public')) {
    whereConditions.push({ visibility: 'public' });
  }

  // Friends-only posts for user's friends
  if (allowedUserIds.length > 0 && allowedVisibilities.includes('friends')) {
    whereConditions.push({
      userId: { [Op.in]: allowedUserIds },
      visibility: 'friends'
    });
  }

  const where = whereConditions.length > 1 ? { [Op.or]: whereConditions } : (whereConditions[0] || {});

  return Post.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
    include: [
      { model: Comment, as: 'comments' },
      { model: Like, as: 'likes' }
    ]
  });
}

function findByUserId(userId, allowedVisibilities = ['public'], limit = 20, offset = 0) {
  return Post.findAndCountAll({
    where: {
      userId,
      visibility: { [Op.in]: allowedVisibilities }
    },
    order: [['createdAt', 'DESC']],
    limit,
    offset,
    include: [
      { model: Comment, as: 'comments' },
      { model: Like, as: 'likes' }
    ]
  });
}

function update(post, updates) {
  return post.update(updates);
}

function remove(post) {
  return post.destroy();
}

module.exports = {
  create,
  findById,
  findFeed,
  findByUserId,
  update,
  remove
};
