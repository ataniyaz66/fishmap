const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const spotsRoutes = require('./routes/spots.routes');
const catchesRoutes = require('./routes/catches.routes');
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
    service: 'fishing',
    status: 'ok'
  });
});

app.use('/api/v1/fishing/spots', spotsRoutes);
app.use('/api/v1/fishing', catchesRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
