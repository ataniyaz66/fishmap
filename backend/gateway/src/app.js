const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const proxyRoutes = require('./routes/proxy.routes');
const {
  notFoundHandler,
  errorHandler
} = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'gateway',
    status: 'ok'
  });
});

app.use(proxyRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
