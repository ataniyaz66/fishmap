#!/usr/bin/env node

/**
 * FishMap Database Migration Runner
 * Executes all database migrations sequentially across services in dependency order:
 * 1. auth
 * 2. users
 * 3. fishing
 * 4. inventory
 * 5. social
 * 6. chat
 */

const { spawnSync } = require('child_process');
const net = require('net');
const path = require('path');

const SERVICES_WITH_MIGRATIONS = [
  { name: 'auth', path: 'backend/services/auth' },
  { name: 'users', path: 'backend/services/users' },
  { name: 'fishing', path: 'backend/services/fishing' },
  { name: 'inventory', path: 'backend/services/inventory' },
  { name: 'social', path: 'backend/services/social' },
  { name: 'chat', path: 'backend/services/chat' }
];

function checkPort(host, port, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isConnected = false;

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      isConnected = true;
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

async function main() {
  console.log('\n========================================');
  console.log('   FishMap Database Migrations Runner');
  console.log('========================================\n');

  // Verify PostgreSQL is reachable on localhost:5434
  const isPostgresUp = await checkPort('127.0.0.1', 5434, 3000);
  if (!isPostgresUp) {
    console.error('❌ Error: PostgreSQL is not reachable on localhost:5434.');
    console.error('   Please start the database container first with:');
    console.error('   npm run infra:up\n');
    process.exit(1);
  }

  console.log('✔ PostgreSQL connection verified on localhost:5434\n');

  const rootDir = path.resolve(__dirname, '..');
  const total = SERVICES_WITH_MIGRATIONS.length;

  for (let i = 0; i < total; i++) {
    const service = SERVICES_WITH_MIGRATIONS[i];
    const step = `[${i + 1}/${total}]`;
    console.log(`${step} Migrating ${service.name} service (${service.path})...`);

    const serviceDir = path.join(rootDir, service.path);
    let result;
    if (process.platform === 'win32') {
      result = spawnSync('cmd.exe', ['/d', '/s', '/c', 'npm run db:migrate'], {
        cwd: serviceDir,
        stdio: 'inherit'
      });
    } else {
      result = spawnSync('npm', ['run', 'db:migrate'], {
        cwd: serviceDir,
        stdio: 'inherit'
      });
    }

    if (result.status !== 0) {
      console.error(`\n❌ Error: Migration failed for service "${service.name}" with exit code ${result.status}.`);
      process.exit(result.status || 1);
    }

    console.log(`✔ ${service.name} migrations complete.\n`);
  }

  console.log('========================================');
  console.log('✔ All 6 service databases are up to date!');
  console.log('========================================\n');
}

main().catch((err) => {
  console.error('Unexpected migration runner error:', err);
  process.exit(1);
});
