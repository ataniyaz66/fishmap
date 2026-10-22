const socialRepository = require('../repositories/social.repository');
const AppError = require('../utils/app-error');

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUuid(value, field) {
  if (typeof value !== 'string' || !uuidPattern.test(value)) {
    throw new AppError(`${field} must be a valid UUID`, 400);
  }
}

async function listNotifications(userId, limit = 30, offset = 0) {
  validateUuid(userId, 'userId');
  const result = await socialRepository.findUserNotifications(userId, limit, offset);
  const unreadCount = await socialRepository.countUnreadNotifications(userId);

  return {
    notifications: result.rows,
    total: result.count,
    unreadCount
  };
}

async function getUnreadCount(userId) {
  validateUuid(userId, 'userId');
  const unreadCount = await socialRepository.countUnreadNotifications(userId);
  return { unreadCount };
}

async function markAsRead(notificationId, userId) {
  validateUuid(notificationId, 'notificationId');
  validateUuid(userId, 'userId');

  const notification = await socialRepository.findNotificationById(notificationId);
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (notification.userId.toLowerCase() !== userId.toLowerCase()) {
    throw new AppError('You do not have access to this notification', 403);
  }

  return socialRepository.markNotificationAsRead(notification);
}

async function markAllAsRead(userId) {
  validateUuid(userId, 'userId');
  await socialRepository.markAllNotificationsAsRead(userId);
  return { success: true };
}

module.exports = {
  listNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};
