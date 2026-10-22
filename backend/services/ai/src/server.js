const app = require('./app');
const env = require('./config/env');

const PORT = env.port || 4008;

app.listen(PORT, () => {
  console.log(`FishMap AI Recommendation Service listening on port ${PORT}`);
});
