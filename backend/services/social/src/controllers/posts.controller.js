const postsService = require('../services/posts.service');

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  create: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const post = await postsService.createPost(userId, req.body);
    res.status(201).json({ data: post });
  }),

  getFeed: asyncHandler(async (req, res) => {
    const requestingUserId = req.user ? req.user.id : null;
    const feed = await postsService.getFeed(requestingUserId, req.query);
    res.status(200).json(feed);
  }),

  getById: asyncHandler(async (req, res) => {
    const requestingUserId = req.user ? req.user.id : null;
    const post = await postsService.getPostById(req.params.id, requestingUserId);
    res.status(200).json({ data: post });
  }),

  getUserPosts: asyncHandler(async (req, res) => {
    const requestingUserId = req.user ? req.user.id : null;
    const posts = await postsService.getUserPosts(req.params.userId, requestingUserId, req.query);
    res.status(200).json(posts);
  }),

  update: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : req.body.user_id;
    const post = await postsService.updatePost(req.params.id, userId, req.body);
    res.status(200).json({ data: post });
  }),

  remove: asyncHandler(async (req, res) => {
    const userId = req.user ? req.user.id : (req.body ? req.body.user_id : null);
    await postsService.deletePost(req.params.id, userId);
    res.status(204).end();
  })
};
