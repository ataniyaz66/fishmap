const { Like, Comment, Friendship, Notification } = require('../models');
const { Op } = require('sequelize');

// Like operations
function findLike(postId, userId) {
  return Like.findOne({ where: { postId, userId } });
}

function createLike(postId, userId) {
  return Like.create({ postId, userId });
}

function removeLike(like) {
  return like.destroy();
}

function countLikes(postId) {
  return Like.count({ where: { postId } });
}

// Comment operations
function createComment(postId, userId, content) {
  return Comment.create({ postId, userId, content });
}

function findCommentById(id) {
  return Comment.findByPk(id);
}

function findCommentsByPostId(postId, limit = 50, offset = 0) {
  const boundedLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const boundedOffset = Math.max(Number(offset) || 0, 0);
  return Comment.findAndCountAll({
    where: { postId },
    order: [['createdAt', 'ASC']],
    limit: boundedLimit,
    offset: boundedOffset
  });
}

function removeComment(comment) {
  return comment.destroy();
}

// Friendship operations
function findFriendshipBetween(userId1, userId2) {
  return Friendship.findOne({
    where: {
      [Op.or]: [
        { requesterId: userId1, addresseeId: userId2 },
        { requesterId: userId2, addresseeId: userId1 }
      ]
    }
  });
}

function createFriendship(requesterId, addresseeId, status = 'pending') {
  return Friendship.create({ requesterId, addresseeId, status });
}

function findFriendshipById(id) {
  return Friendship.findByPk(id);
}

function updateFriendship(friendship, updates) {
  return friendship.update(updates);
}

function listUserFriendships(userId, status = 'accepted') {
  return Friendship.findAll({
    where: {
      status,
      [Op.or]: [
        { requesterId: userId },
        { addresseeId: userId }
      ]
    }
  });
}

function listPendingRequests(userId) {
  return Friendship.findAll({
    where: {
      addresseeId: userId,
      status: 'pending'
    }
  });
}

function listOutgoingRequests(userId) {
  return Friendship.findAll({
    where: {
      requesterId: userId,
      status: 'pending'
    }
  });
}

function removeFriendship(friendship) {
  return friendship.destroy();
}

// Notification operations
function createNotification(data) {
  return Notification.create(data);
}

function findUserNotifications(userId, limit = 30, offset = 0) {
  const boundedLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);
  const boundedOffset = Math.max(Number(offset) || 0, 0);
  return Notification.findAndCountAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit: boundedLimit,
    offset: boundedOffset
  });
}

function countUnreadNotifications(userId) {
  return Notification.count({
    where: { userId, read: false }
  });
}

function findNotificationById(id) {
  return Notification.findByPk(id);
}

function markNotificationAsRead(notification) {
  return notification.update({ read: true });
}

function markAllNotificationsAsRead(userId) {
  return Notification.update({ read: true }, { where: { userId, read: false } });
}

module.exports = {
  findLike,
  createLike,
  removeLike,
  countLikes,
  createComment,
  findCommentById,
  findCommentsByPostId,
  removeComment,
  findFriendshipBetween,
  createFriendship,
  findFriendshipById,
  updateFriendship,
  listUserFriendships,
  listPendingRequests,
  createNotification,
  findUserNotifications,
  countUnreadNotifications,
  findNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead
};
