const app = require('./app');
const { port } = require('./config/env');

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
