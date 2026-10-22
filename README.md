# FishMap

FishMap is a modern cross-platform fishing social network for recreational anglers. It combines interactive fishing maps, catch logging, tackle inventory management, social sharing, weather forecasts, and AI-powered fishing assistance.

## Architecture

FishMap uses a modular microservices monorepo architecture:

| Component | Directory | Port | Description |
|-----------|-----------|------|-------------|
| **API Gateway** | `backend/gateway` | `4000` | Unified reverse proxy routing client requests to downstream microservices with error normalization. |
| **Auth Service** | `backend/services/auth` | `4001` | User credentials, password hashing (bcryptjs), short-lived JWT access tokens, rotating refresh tokens with reuse detection. |
| **Users Service** | `backend/services/users` | `4002` | Angler profiles, biographies, avatars, locations, and privacy controls. |
| **Fishing Service** | `backend/services/fishing` | `4003` | Fishing spots (bounding-box & radius queries via Haversine / PostGIS), catches, fishing sessions, favorites, reports, and catch analytics. |
| **Inventory Service** | `backend/services/inventory` | `4004` | Tackle inventory (lures, rods, reels, line, terminal tackle), categories, specifications, and visibility rules. |
| **Social Service** | `backend/services/social` | `4005` | Community feed, posts, photo galleries, likes, comments, friend requests, user blocking, and notifications. |
| **Chat Service** | `backend/services/chat` | `4006` | 1-on-1 direct messaging, conversation histories, read receipts, and participant authorization. |
| **Weather Service** | `backend/services/weather` | `4007` | Real-time conditions (pressure, wind, temperature, cloud cover), multi-day forecasts via Open-Meteo API, in-memory grid caching, and fishing suitability index. |
| **AI Recommendation** | `backend/services/ai` | `4008` | Intelligent lure recommendations matching personal tackle inventory, angling technique assistant (Gemini 1.5 Flash + Rule-based fallback engine). |
| **PostgreSQL / PostGIS** | `infrastructure/postgres` | `5434` (host) | Dedicated per-service databases in a single PostGIS container (`fishmap_auth`, `fishmap_users`, `fishmap_fishing`, etc.). |
| **Frontend** | `frontend/flutter_app` | — | Cross-platform Flutter client. |

---

## Local Development Workflow (Windows PowerShell)

### 1. Prerequisites

- **Node.js**: v20 or higher (tested on Node.js v24)
- **Docker Desktop**: Running with WSL2 or Hyper-V backend
- **Windows PowerShell**: PowerShell 5.1+ or PowerShell 7 (pwsh)
- **Git**

Verify your environment in PowerShell:
```powershell
node -v
docker --version
docker compose version
```

---

### 2. First-Time Setup

#### Step A: Configure Environment Files
A root `.env.example` provides the global reference. In PowerShell, create all service `.env` files automatically from their `.env.example` templates:

```powershell
Get-ChildItem -Recurse -Filter ".env.example" | ForEach-Object {
    Copy-Item $_.FullName ($_.DirectoryName + "\.env") -Force
}
```

#### Step B: Start PostgreSQL & PostGIS Infrastructure
Launch the database container in detached mode:

```powershell
npm run infra:up
```

*This spins up `fishmap-postgres` on host port `5434` (`5432` container internal) with persistent volume `fishmap_postgres_data` and initializes all service databases.*

Check container health:
```powershell
npm run infra:status
```

#### Step C: Run All Database Migrations
Run the sequential migration suite across all database-backed services (`auth`, `users`, `fishing`, `inventory`, `social`, `chat`):

```powershell
npm run db:migrate:all
```

---

### 3. Starting the Development Environment

Start the API Gateway and all eight backend microservices together in a single terminal with formatted, color-coded logging:

```powershell
npm run dev:all
```

*Notes on `dev:all`:*
- Uses `nodemon` to automatically reload services when source code is saved.
- Verifies PostgreSQL connectivity before spawning services.
- If you prefer standard Node without watch mode: `npm run dev:all:nowatch`.
- Graceful Windows shutdown: press `Ctrl+C` to terminate the entire process tree without leaving orphaned background node processes.

---

### 4. Verifying System Health

Open a second PowerShell terminal while `npm run dev:all` is running:

```powershell
npm run health:check
```

Outputs a formatted status report:
```text
┌────────────────┬──────┬────────┬──────────────┬──────────────────────────────────┐
│ Service        │ Port │ Status │ Latency (ms) │ Details                          │
├────────────────┼──────┼────────┼──────────────┼──────────────────────────────────┤
│ Gateway        │ 4000 │ PASS   │        22 ms │ HTTP 200 (ok)                    │
│ Auth           │ 4001 │ PASS   │        22 ms │ HTTP 200 (ok)                    │
│ Users          │ 4002 │ PASS   │        19 ms │ HTTP 200 (ok)                    │
│ Fishing        │ 4003 │ PASS   │        21 ms │ HTTP 200 (ok)                    │
│ Inventory      │ 4004 │ PASS   │        20 ms │ HTTP 200 (ok)                    │
│ Social         │ 4005 │ PASS   │        20 ms │ HTTP 200 (ok)                    │
│ Chat           │ 4006 │ PASS   │        19 ms │ HTTP 200 (ok)                    │
│ Weather        │ 4007 │ PASS   │        19 ms │ HTTP 200 (ok)                    │
│ AI Assistant   │ 4008 │ PASS   │        20 ms │ HTTP 200 (ok)                    │
└────────────────┴──────┴────────┴──────────────┴──────────────────────────────────┘

Summary: 9 Total | 9 Online | 0 Offline
✔ All FishMap services are healthy and responding!
```

---

### 5. Running Automated Tests

#### Full Regression Test Suite
Run all unit and integration tests across all 9 services:

```powershell
npm test
```

#### Individual Service Tests
Run tests for a single service:

```powershell
npm run test:auth
npm run test:users
npm run test:fishing
npm run test:inventory
npm run test:social
npm run test:chat
npm run test:weather
npm run test:ai
npm run test:gateway
```

#### End-to-End Runtime Verification
To execute all 13 end-to-end user journeys (auth, profiles, spots, catches, inventory, social feed, chat, weather, AI lure advice, analytics) through the API Gateway:

```powershell
node scripts/verify-e2e-runtime.js
```

---

### 6. Clean Shutdown

1. **Backend Services**: In the terminal running `npm run dev:all`, press `Ctrl+C`. The runner intercepts `SIGINT` and executes a tree-kill on Windows, safely shutting down all 9 services.
2. **Database Infrastructure**: When you are finished developing, stop the PostgreSQL container while preserving all data volumes:

```powershell
npm run infra:down
```

---

## Root NPM Scripts Reference

| Command | Action |
|---------|--------|
| `npm run infra:up` | Starts PostgreSQL container via Docker Compose (`docker compose up -d postgres`) |
| `npm run infra:down` | Stops PostgreSQL container (`docker compose stop postgres`) |
| `npm run infra:status` | Shows status of PostgreSQL container (`docker compose ps postgres`) |
| `npm run db:migrate:all` | Runs migrations across all 6 database-backed services in dependency order |
| `npm run dev:all` | Starts API Gateway + all 8 microservices concurrently with live reload (nodemon) |
| `npm run dev:all:nowatch`| Starts API Gateway + all 8 microservices without file watcher |
| `npm run health:check` | Queries `/health` across all 9 services and prints a PASS/FAIL summary table |
| `npm test` | Runs test suites across all 9 services |

---

## Documentation

- [Architecture & Boundaries](docs/architecture.md)
- [Database Ownership & Schemas](docs/database.md)
- [API Gateway Specification](backend/gateway/API.md)
- [Auth Service Specification](backend/services/auth/API.md)
- [Users Service Specification](backend/services/users/API.md)
- [Fishing Service Specification](backend/services/fishing/API.md)
- [Inventory Service Specification](backend/services/inventory/API.md)
- [Social Service Specification](backend/services/social/API.md)
- [Chat Service Specification](backend/services/chat/API.md)
- [Weather Service Specification](backend/services/weather/API.md)
- [AI Service Specification](backend/services/ai/API.md)
