#!/usr/bin/env node

/**
 * FishMap Health Check Utility
 * Verifies that the API Gateway and all eight backend services are online and responding.
 */

const http = require('http');

const SERVICES = [
  { name: 'Gateway', port: 4000, path: '/health', expectedStatus: 200 },
  { name: 'Auth', port: 4001, path: '/health', expectedStatus: 200 },
  { name: 'Users', port: 4002, path: '/health', expectedStatus: 200 },
  { name: 'Fishing', port: 4003, path: '/health', expectedStatus: 200 },
  { name: 'Inventory', port: 4004, path: '/health', expectedStatus: 200 },
  { name: 'Social', port: 4005, path: '/health', expectedStatus: 200 },
  { name: 'Chat', port: 4006, path: '/health', expectedStatus: 200 },
  { name: 'Weather', port: 4007, path: '/health', expectedStatus: 200 },
  { name: 'AI Assistant', port: 4008, path: '/health', expectedStatus: 200 }
];

function checkService(service, timeoutMs = 3000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = http.get(
      {
        hostname: '127.0.0.1',
        port: service.port,
        path: service.path,
        timeout: timeoutMs
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          const latencyMs = Date.now() - startTime;
          const isOk = res.statusCode === service.expectedStatus;
          let details = `HTTP ${res.statusCode}`;

          try {
            const parsed = JSON.parse(body);
            if (parsed.status) {
              details += ` (${parsed.status})`;
            }
          } catch (_) {}

          resolve({
            name: service.name,
            port: service.port,
            status: isOk ? 'PASS' : 'FAIL',
            latencyMs,
            details
          });
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: service.name,
        port: service.port,
        status: 'FAIL',
        latencyMs: Date.now() - startTime,
        details: 'ETIMEDOUT (connection timed out)'
      });
    });

    req.on('error', (err) => {
      resolve({
        name: service.name,
        port: service.port,
        status: 'FAIL',
        latencyMs: Date.now() - startTime,
        details: err.code === 'ECONNREFUSED' ? 'ECONNREFUSED (service not running)' : err.message
      });
    });
  });
}

function pad(str, len, align = 'left') {
  const s = String(str);
  if (s.length >= len) return s.slice(0, len);
  const diff = len - s.length;
  return align === 'right' ? ' '.repeat(diff) + s : s + ' '.repeat(diff);
}

async function main() {
  console.log('\n================================================================');
  console.log('                 FishMap Health Check Runner                    ');
  console.log('================================================================\n');

  const results = await Promise.all(SERVICES.map((s) => checkService(s)));

  // Table header
  console.log('┌────────────────┬──────┬────────┬──────────────┬──────────────────────────────────┐');
  console.log('│ Service        │ Port │ Status │ Latency (ms) │ Details                          │');
  console.log('├────────────────┼──────┼────────┼──────────────┼──────────────────────────────────┤');

  let passedCount = 0;
  for (const r of results) {
    const isPass = r.status === 'PASS';
    if (isPass) passedCount++;

    const statusBadge = isPass ? 'PASS  ' : 'FAIL  ';
    const row = `│ ${pad(r.name, 14)} │ ${pad(r.port, 4, 'right')} │ ${statusBadge} │ ${pad(r.latencyMs + ' ms', 12, 'right')} │ ${pad(r.details, 32)} │`;
    console.log(row);
  }

  console.log('└────────────────┴──────┴────────┴──────────────┴──────────────────────────────────┘');

  const total = results.length;
  const failedCount = total - passedCount;

  console.log(`\nSummary: ${total} Total | ${passedCount} Online | ${failedCount} Offline\n`);

  if (failedCount > 0) {
    console.error('❌ Some services are offline. Run "npm run dev:all" to start all services.\n');
    process.exit(1);
  } else {
    console.log('✔ All FishMap services are healthy and responding!\n');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal health check error:', err);
  process.exit(1);
});
