const socialRepository = require('../repositories/social.repository');
const postsRepository = require('../repositories/posts.repository');
const AppError = require('../utils/app-error');

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUuid(value, field) {
  if (typeof value !== 'string' || !uuidPattern.test(value)) {
    throw new AppError(`${field} must be a valid UUID`, 400);
  }
}

async function toggleLike(postId, userId) {
  validateUuid(postId, 'postId');
  validateUuid(userId, 'userId');

  const post = await postsRepository.findById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const existing = await socialRepository.findLike(postId, userId);
  if (existing) {
    await socialRepository.removeLike(existing);
    const likeCount = await socialRepository.countLikes(postId);
    return { liked: false, likeCount };
  }

  await socialRepository.createLike(postId, userId);
  const likeCount = await socialRepository.countLikes(postId);

  // Notify post author if not liking own post
  if (post.userId.toLowerCase() !== userId.toLowerCase()) {
    await socialRepository.createNotification({
      userId: post.userId,
      actorId: userId,
      type: 'post_like',
      entityId: postId
    });
  }

  return { liked: true, likeCount };
}

async function addComment(postId, userId, content) {
  validateUuid(postId, 'postId');
  validateUuid(userId, 'userId');

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    throw new AppError('Comment content is required and cannot be empty', 400);
  }

  const post = await postsRepository.findById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const comment = await socialRepository.createComment(postId, userId, content.trim());

  // Notify post author if not commenting on own post
  if (post.userId.toLowerCase() !== userId.toLowerCase()) {
    await socialRepository.createNotification({
      userId: post.userId,
      actorId: userId,
      type: 'post_comment',
      entityId: postId
    });
  }

  return comment;
}

async function listComments(postId, limit = 50, offset = 0) {
  validateUuid(postId, 'postId');
  return socialRepository.findCommentsByPostId(postId, limit, offset);
}

async function deleteComment(commentId, userId) {
  validateUuid(commentId, 'commentId');
  validateUuid(userId, 'userId');

  const comment = await socialRepository.findCommentById(commentId);
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  const post = await postsRepository.findById(comment.postId);

  // Author of comment or author of post can delete
  const isCommentAuthor = comment.userId.toLowerCase() === userId.toLowerCase();
  const isPostAuthor = post && post.userId.toLowerCase() === userId.toLowerCase();

  if (!isCommentAuthor && !isPostAuthor) {
    throw new AppError('You are not authorized to delete this comment', 403);
  }

  await socialRepository.removeComment(comment);
}

module.exports = {
  toggleLike,
  addComment,
  listComments,
  deleteComment
};
