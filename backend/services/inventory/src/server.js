const app = require('./app');
const { port } = require('./config/env');

app.listen(port, () => {
  console.log(`Inventory Service listening on port ${port}`);
});
