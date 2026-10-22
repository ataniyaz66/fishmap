#!/usr/bin/env node

/**
 * FishMap Multi-Service Runner (dev:all)
 * Spawns API Gateway and all eight backend services with colored prefixes
 * and provides graceful cross-platform process tree termination on Ctrl+C.
 */

const { spawn, execSync } = require('child_process');
const net = require('net');
const path = require('path');
const readline = require('readline');

const SERVICES = [
  { name: 'gateway',   color: '\x1b[36m', path: 'backend/gateway',          port: 4000 },
  { name: 'auth',      color: '\x1b[33m', path: 'backend/services/auth',     port: 4001 },
  { name: 'users',     color: '\x1b[34m', path: 'backend/services/users',    port: 4002 },
  { name: 'fishing',   color: '\x1b[32m', path: 'backend/services/fishing',  port: 4003 },
  { name: 'inventory', color: '\x1b[35m', path: 'backend/services/inventory',port: 4004 },
  { name: 'social',    color: '\x1b[31m', path: 'backend/services/social',   port: 4005 },
  { name: 'chat',      color: '\x1b[95m', path: 'backend/services/chat',     port: 4006 },
  { name: 'weather',   color: '\x1b[96m', path: 'backend/services/weather',  port: 4007 },
  { name: 'ai',        color: '\x1b[92m', path: 'backend/services/ai',       port: 4008 }
];

const RESET_COLOR = '\x1b[0m';
const BOLD = '\x1b[1m';
const rootDir = path.resolve(__dirname, '..');
const runningProcesses = [];
let isShuttingDown = false;

function checkPort(host, port, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
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

function killProcessTree(pid) {
  if (!pid) return;
  if (process.platform === 'win32') {
    try {
      execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
    } catch (_) {}
  } else {
    try {
      process.kill(-pid, 'SIGTERM');
    } catch (_) {
      try {
        process.kill(pid, 'SIGTERM');
      } catch (_) {}
    }
  }
}

function shutdownAll(exitCode = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n${BOLD}[dev:all] Stopping all FishMap services...${RESET_COLOR}`);

  for (const item of runningProcesses) {
    if (item.child && !item.child.killed) {
      killProcessTree(item.child.pid);
    }
  }

  setTimeout(() => {
    console.log(`${BOLD}[dev:all] All services stopped.${RESET_COLOR}\n`);
    process.exit(exitCode);
  }, 600);
}

process.on('SIGINT', () => shutdownAll(0));
process.on('SIGTERM', () => shutdownAll(0));
process.on('exit', () => shutdownAll(0));

function attachPrefixedLogging(stream, prefix, color) {
  if (!stream) return;
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  rl.on('line', (line) => {
    if (line.trim().length > 0) {
      console.log(`${color}${BOLD}[${prefix}]${RESET_COLOR} ${line}`);
    }
  });
}

async function startService(svc, useNodemon = true) {
  const serviceCwd = path.join(rootDir, svc.path);
  const prefix = svc.name.padEnd(9);

  let cmd;
  let args;

  if (process.platform === 'win32') {
    cmd = 'cmd.exe';
    args = ['/d', '/s', '/c', useNodemon ? 'npm run dev' : 'node src/server.js'];
  } else {
    cmd = 'npm';
    args = useNodemon ? ['run', 'dev'] : ['start'];
  }

  const child = spawn(cmd, args, {
    cwd: serviceCwd,
    env: { ...process.env, PORT: String(svc.port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  runningProcesses.push({ name: svc.name, child });

  attachPrefixedLogging(child.stdout, prefix, svc.color);
  attachPrefixedLogging(child.stderr, prefix, svc.color);

  child.on('error', (err) => {
    console.error(`${svc.color}${BOLD}[${prefix}]${RESET_COLOR} Process error: ${err.message}`);
  });

  child.on('close', (code) => {
    if (!isShuttingDown && code !== 0 && code !== null) {
      console.log(`${svc.color}${BOLD}[${prefix}]${RESET_COLOR} Exited with code ${code}`);
    }
  });
}

async function main() {
  const useNoWatch = process.argv.includes('--no-watch');

  console.log('\n================================================================');
  console.log('            FishMap Development Environment (dev:all)           ');
  console.log('================================================================');
  console.log(`Starting API Gateway and 8 microservices (${useNoWatch ? 'node direct' : 'nodemon watching'})...`);
  console.log('Press Ctrl+C to terminate all services gracefully.\n');

  // Check PostgreSQL
  const isPgUp = await checkPort('127.0.0.1', 5434, 1500);
  if (!isPgUp) {
    console.warn('\x1b[33m[dev:all] ⚠️ PostgreSQL is not reachable on localhost:5434.');
    console.warn('          Run "npm run infra:up" in another terminal to start the database container.\x1b[0m\n');
  } else {
    console.log('\x1b[32m[dev:all] ✔ PostgreSQL detected on localhost:5434\x1b[0m\n');
  }

  for (const svc of SERVICES) {
    startService(svc, !useNoWatch);
  }
}

main().catch((err) => {
  console.error('Fatal dev:all runner error:', err);
  shutdownAll(1);
});
