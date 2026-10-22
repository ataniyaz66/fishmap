const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const postsRoutes = require('./routes/posts.routes');
const friendsRoutes = require('./routes/friends.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const {
  notFoundHandler,
  errorHandler
} = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'social',
    status: 'ok'
  });
});

app.use('/api/v1/social/posts', postsRoutes);
app.use('/api/v1/social/friends', friendsRoutes);
app.use('/api/v1/social/notifications', notificationsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
