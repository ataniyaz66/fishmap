const app = require('./app');
const env = require('./config/env');

const PORT = env.port || 4005;

app.listen(PORT, () => {
  console.log(`FishMap Social Service listening on port ${PORT}`);
});
