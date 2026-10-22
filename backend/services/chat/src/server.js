const app = require('./app');
const env = require('./config/env');

const PORT = env.port || 4006;

app.listen(PORT, () => {
  console.log(`FishMap Chat Service listening on port ${PORT}`);
});
