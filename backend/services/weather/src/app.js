const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const weatherRoutes = require('./routes/weather.routes');
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
    service: 'weather',
    status: 'ok'
  });
});

app.use('/api/v1/weather', weatherRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
