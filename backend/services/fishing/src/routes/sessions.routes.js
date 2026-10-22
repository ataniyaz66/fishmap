const express = require('express');
const sessionsController = require('../controllers/sessions.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateUser);

router.route('/')
  .post(sessionsController.create)
  .get(sessionsController.list);

router.route('/:id')
  .get(sessionsController.getById)
  .patch(sessionsController.update)
  .delete(sessionsController.remove);

module.exports = router;
