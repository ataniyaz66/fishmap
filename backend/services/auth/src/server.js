const config = require('./config/env');
const app = require('./app');
const { connectDatabase, closeDatabase } = require('./database/connection');

let server;

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down Auth service.`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await closeDatabase();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

async function startServer() {
  try {
    await connectDatabase();

    server = app.listen(config.port, () => {
      console.log(`Auth service listening on port ${config.port} (${config.nodeEnv})`);
    });
  } catch (error) {
    console.error('Auth service failed to start because the database connection could not be established.');
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
