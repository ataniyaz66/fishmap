const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const chatRoutes = require('./routes/chat.routes');
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
    service: 'chat',
    status: 'ok'
  });
});

app.use('/api/v1/chat', chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
