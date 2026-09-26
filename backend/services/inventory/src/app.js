const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const inventoryRoutes = require('./routes/inventory.routes');
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
    service: 'inventory',
    status: 'ok'
  });
});

app.use('/api/v1/inventory', inventoryRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
