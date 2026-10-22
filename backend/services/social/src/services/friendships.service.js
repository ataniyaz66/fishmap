const socialRepository = require('../repositories/social.repository');
const AppError = require('../utils/app-error');

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUuid(value, field) {
  if (typeof value !== 'string' || !uuidPattern.test(value)) {
    throw new AppError(`${field} must be a valid UUID`, 400);
  }
}

async function sendFriendRequest(requesterId, addresseeId) {
  validateUuid(requesterId, 'requesterId');
  validateUuid(addresseeId, 'addresseeId');

  if (requesterId.toLowerCase() === addresseeId.toLowerCase()) {
    throw new AppError('Cannot send a friend request to yourself', 400);
  }

  const existing = await socialRepository.findFriendshipBetween(requesterId, addresseeId);
  if (existing) {
    if (existing.status === 'accepted') {
      throw new AppError('You are already friends with this user', 409);
    }
    if (existing.status === 'pending') {
      throw new AppError('A friend request is already pending', 409);
    }
    if (existing.status === 'blocked') {
      throw new AppError('Cannot send friend request to this user', 403);
    }
    // If declined previously, reactivate to pending
    const updated = await socialRepository.updateFriendship(existing, {
      requesterId,
      addresseeId,
      status: 'pending'
    });

    await socialRepository.createNotification({
      userId: addresseeId,
      actorId: requesterId,
      type: 'friend_request',
      entityId: updated.id
    });

    return updated;
  }

  const friendship = await socialRepository.createFriendship(requesterId, addresseeId, 'pending');

  await socialRepository.createNotification({
    userId: addresseeId,
    actorId: requesterId,
    type: 'friend_request',
    entityId: friendship.id
  });

  return friendship;
}

async function acceptFriendRequest(userId, friendshipId) {
  validateUuid(userId, 'userId');
  validateUuid(friendshipId, 'friendshipId');

  const friendship = await socialRepository.findFriendshipById(friendshipId);
  if (!friendship) {
    throw new AppError('Friend request not found', 404);
  }

  if (friendship.addresseeId.toLowerCase() !== userId.toLowerCase()) {
    throw new AppError('You are not authorized to accept this friend request', 403);
  }

  if (friendship.status !== 'pending') {
    throw new AppError(`Cannot accept a request with status ${friendship.status}`, 400);
  }

  const updated = await socialRepository.updateFriendship(friendship, { status: 'accepted' });

  await socialRepository.createNotification({
    userId: friendship.requesterId,
    actorId: userId,
    type: 'friend_accept',
    entityId: updated.id
  });

  return updated;
}

async function declineFriendRequest(userId, friendshipId) {
  validateUuid(userId, 'userId');
  validateUuid(friendshipId, 'friendshipId');

  const friendship = await socialRepository.findFriendshipById(friendshipId);
  if (!friendship) {
    throw new AppError('Friend request not found', 404);
  }

  if (friendship.addresseeId.toLowerCase() !== userId.toLowerCase()) {
    throw new AppError('You are not authorized to decline this friend request', 403);
  }

  return socialRepository.updateFriendship(friendship, { status: 'declined' });
}

async function blockUser(userId, targetUserId) {
  validateUuid(userId, 'userId');
  validateUuid(targetUserId, 'targetUserId');

  const existing = await socialRepository.findFriendshipBetween(userId, targetUserId);
  if (existing) {
    return socialRepository.updateFriendship(existing, {
      requesterId: userId,
      addresseeId: targetUserId,
      status: 'blocked'
    });
  }

  return socialRepository.createFriendship(userId, targetUserId, 'blocked');
}

async function listFriends(userId) {
  validateUuid(userId, 'userId');
  const friendships = await socialRepository.listUserFriendships(userId, 'accepted');

  const friendIds = friendships.map((f) =>
    f.requesterId.toLowerCase() === userId.toLowerCase() ? f.addresseeId : f.requesterId
  );

  return { friends: friendIds, total: friendIds.length };
}

async function listPendingRequests(userId, type = 'received') {
  validateUuid(userId, 'userId');
  let requests;
  if (type === 'sent') {
    requests = await socialRepository.listOutgoingRequests(userId);
  } else {
    requests = await socialRepository.listPendingRequests(userId);
  }
  return { requests, total: requests.length };
}

async function getFriendshipStatus(userId, targetUserId) {
  validateUuid(userId, 'userId');
  validateUuid(targetUserId, 'targetUserId');

  if (userId.toLowerCase() === targetUserId.toLowerCase()) {
    return { status: 'self', friendship: null };
  }

  const friendship = await socialRepository.findFriendshipBetween(userId, targetUserId);
  if (!friendship) {
    return { status: 'none', friendship: null };
  }

  if (friendship.status === 'accepted') {
    return { status: 'friends', friendship };
  }

  if (friendship.status === 'blocked') {
    return { status: 'blocked', friendship };
  }

  if (friendship.status === 'pending') {
    if (friendship.requesterId.toLowerCase() === userId.toLowerCase()) {
      return { status: 'pending_sent', friendship };
    } else {
      return { status: 'pending_received', friendship };
    }
  }

  return { status: 'none', friendship };
}

async function removeFriendOrRequest(userId, targetId) {
  validateUuid(userId, 'userId');
  let friendship = await socialRepository.findFriendshipById(targetId);
  if (!friendship) {
    friendship = await socialRepository.findFriendshipBetween(userId, targetId);
  }
  if (!friendship) {
    throw new AppError('Friendship or request not found', 404);
  }

  if (
    friendship.requesterId.toLowerCase() !== userId.toLowerCase() &&
    friendship.addresseeId.toLowerCase() !== userId.toLowerCase()
  ) {
    throw new AppError('You are not authorized to remove this friendship', 403);
  }

  await socialRepository.removeFriendship(friendship);
  return { success: true };
}

async function areFriends(userId1, userId2) {
  if (!userId1 || !userId2) return false;
  const friendship = await socialRepository.findFriendshipBetween(userId1, userId2);
  return !!(friendship && friendship.status === 'accepted');
}

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  blockUser,
  listFriends,
  listPendingRequests,
  getFriendshipStatus,
  removeFriendOrRequest,
  areFriends
};
