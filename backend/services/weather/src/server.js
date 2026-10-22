const app = require('./app');
const env = require('./config/env');

const PORT = env.port || 4007;

app.listen(PORT, () => {
  console.log(`FishMap Weather Service listening on port ${PORT}`);
});
