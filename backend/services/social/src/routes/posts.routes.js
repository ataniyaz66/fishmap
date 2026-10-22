const express = require('express');
const postsController = require('../controllers/posts.controller');
const interactionsController = require('../controllers/interactions.controller');
const { authenticateUser, optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Comments routes
router.delete('/comments/:commentId', authenticateUser, interactionsController.deleteComment);

// User-specific posts route
router.get('/user/:userId', optionalAuth, postsController.getUserPosts);

// Feed & creation
router.route('/')
  .get(optionalAuth, postsController.getFeed)
  .post(authenticateUser, postsController.create);

// Single post operations
router.route('/:id')
  .get(optionalAuth, postsController.getById)
  .patch(authenticateUser, postsController.update)
  .delete(authenticateUser, postsController.remove);

// Interactions on post
router.post('/:id/like', authenticateUser, interactionsController.toggleLike);

router.route('/:id/comments')
  .get(optionalAuth, interactionsController.listComments)
  .post(authenticateUser, interactionsController.addComment);

module.exports = router;
