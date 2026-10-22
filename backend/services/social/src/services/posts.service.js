const postsRepository = require('../repositories/posts.repository');
const friendshipsService = require('./friendships.service');
const AppError = require('../utils/app-error');

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUuid(value, field) {
  if (typeof value !== 'string' || !uuidPattern.test(value)) {
    throw new AppError(`${field} must be a valid UUID`, 400);
  }
}

async function createPost(userId, body) {
  validateUuid(userId, 'userId');
  if (!body || !body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
    throw new AppError('Post content is required and cannot be empty', 400);
  }

  const visibility = body.visibility || 'public';
  if (!['public', 'friends', 'private'].includes(visibility)) {
    throw new AppError('visibility must be public, friends, or private', 400);
  }

  const photoUrls = Array.isArray(body.photo_urls || body.photoUrls)
    ? (body.photo_urls || body.photoUrls)
    : [];

  const post = await postsRepository.create({
    userId,
    content: body.content.trim(),
    photoUrls,
    spotId: body.spot_id || body.spotId || null,
    catchId: body.catch_id || body.catchId || null,
    visibility
  });

  return post;
}

async function getPostById(id, requestingUserId = null) {
  validateUuid(id, 'id');
  const post = await postsRepository.findById(id);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Access check
  if (post.visibility === 'private' && post.userId !== requestingUserId) {
    throw new AppError('Post not found', 404);
  }

  if (post.visibility === 'friends' && post.userId !== requestingUserId) {
    const isFriend = await friendshipsService.areFriends(post.userId, requestingUserId);
    if (!isFriend) {
      throw new AppError('Post not found', 404);
    }
  }

  return post;
}

async function getFeed(requestingUserId = null, query = {}) {
  const limit = Math.min(Number(query.limit) || 20, 50);
  const offset = Math.max(Number(query.offset) || 0, 0);

  let allowedUserIds = [];
  let allowedVisibilities = ['public'];

  if (requestingUserId) {
    allowedVisibilities.push('friends');
    const { friends } = await friendshipsService.listFriends(requestingUserId);
    allowedUserIds = [requestingUserId, ...friends];
  }

  const result = await postsRepository.findFeed(allowedUserIds, allowedVisibilities, limit, offset);

  return {
    data: result.rows,
    total: result.count,
    limit,
    offset
  };
}

async function getUserPosts(targetUserId, requestingUserId = null, query = {}) {
  validateUuid(targetUserId, 'targetUserId');
  const limit = Math.min(Number(query.limit) || 20, 50);
  const offset = Math.max(Number(query.offset) || 0, 0);

  const allowedVisibilities = ['public'];

  if (requestingUserId && requestingUserId.toLowerCase() === targetUserId.toLowerCase()) {
    allowedVisibilities.push('friends', 'private');
  } else if (requestingUserId) {
    const isFriend = await friendshipsService.areFriends(targetUserId, requestingUserId);
    if (isFriend) {
      allowedVisibilities.push('friends');
    }
  }

  const result = await postsRepository.findByUserId(targetUserId, allowedVisibilities, limit, offset);

  return {
    data: result.rows,
    total: result.count,
    limit,
    offset
  };
}

async function updatePost(id, userId, body) {
  validateUuid(id, 'id');
  validateUuid(userId, 'userId');

  const post = await postsRepository.findById(id);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.userId.toLowerCase() !== userId.toLowerCase()) {
    throw new AppError('You are not authorized to edit this post', 403);
  }

  const updates = {};
  if (body.content !== undefined) {
    if (typeof body.content !== 'string' || body.content.trim().length === 0) {
      throw new AppError('Content cannot be empty', 400);
    }
    updates.content = body.content.trim();
  }

  if (body.visibility !== undefined) {
    if (!['public', 'friends', 'private'].includes(body.visibility)) {
      throw new AppError('visibility must be public, friends, or private', 400);
    }
    updates.visibility = body.visibility;
  }

  if (body.photo_urls !== undefined || body.photoUrls !== undefined) {
    const photos = body.photo_urls || body.photoUrls;
    if (Array.isArray(photos)) {
      updates.photoUrls = photos;
    }
  }

  return postsRepository.update(post, updates);
}

async function deletePost(id, userId) {
  validateUuid(id, 'id');
  validateUuid(userId, 'userId');

  const post = await postsRepository.findById(id);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.userId.toLowerCase() !== userId.toLowerCase()) {
    throw new AppError('You are not authorized to delete this post', 403);
  }

  await postsRepository.remove(post);
}

module.exports = {
  createPost,
  getPostById,
  getFeed,
  getUserPosts,
  updatePost,
  deletePost
};
