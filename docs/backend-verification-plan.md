# FishMap Backend Verification and Testing Plan

**Author:** Rustam Ataniyazov<br>
**Project:** FishMap — Cross-Platform Intelligent System for Recreational Fishing<br>
**Task:** YouTrack FIS-21 — Write verification plan for backend<br>
**Target Document:** `docs/backend-verification-plan.md`
**Repository Branch:** `FIS-21-backend-verification-plan`
**Baseline Commit:** `f0560f9651e54346d66b147a7b784ab5580ac324` (`origin/main`, October 2026)
**Related Documents:** [`docs/backend-requirements.md`](backend-requirements.md), [`docs/architecture.md`](architecture.md), [`docs/database.md`](database.md), [`docs/verification-plan-client-ai.md`](verification-plan-client-ai.md)

---

## 1. Introduction and Objectives

### 1.1 Purpose
This document establishes the comprehensive verification and evaluation plan for the FishMap backend infrastructure, API Gateway, and domain microservices. It defines the methodologies, test categories, quantitative metrics, environmental measurement conditions, and acceptance criteria required to validate that the backend fulfills all functional requirements (FR-AUTH through FR-API) and non-functional requirements (NFR-PERF, NFR-SEC, NFR-REL, NFR-MAINT) specified in [`docs/backend-requirements.md`](backend-requirements.md).

### 1.2 System Scope
The backend architecture comprises a distributed, modular microservices ecosystem orchestrated via Docker Compose and Node.js:
1. **API Gateway (Port 4000):** Centralized Express reverse proxy managing routing, CORS, security headers (Helmet), request timeouts, and error handling.
2. **Auth Service (Port 4001):** User registration, password hashing (bcryptjs), JWT token issuance/refresh, and password recovery.
3. **Users Service (Port 4002):** Angler profile management, preferences, avatars, and bios.
4. **Fishing Service (Port 4003):** PostGIS-backed geospatial spot cataloging, catch records, fishing session tracking, and personal angling analytics.
5. **Inventory Service (Port 4004):** Angler tackle locker management (rods, reels, lines, lures).
6. **Social Service (Port 4005):** Activity feeds, community posts, threaded comments, likes, follower/friendship graphs, and notifications.
7. **Chat Service (Port 4006):** Private direct messaging conversations, message persistence, and read receipts.
8. **Weather Service (Port 4007):** In-memory cached meteorological telemetry and 7-day forecasts integrated with the external Open-Meteo REST API.
9. **AI Recommendation Service (Port 4008):** Hybrid angling intelligence featuring primary integration with the Google Gemini API (`gemini-1.5-flash`) and an automated, deterministic rule-based fallback provider.
10. **Data Persistence Tier:** PostgreSQL 16 with PostGIS 3.4 spatial extension, operating dedicated per-service databases (`fishmap_auth`, `fishmap_users`, `fishmap_fishing`, `fishmap_inventory`, `fishmap_social`, `fishmap_chat`).

---

## 2. Test Strategy

The verification strategy organizes tests across seven distinct levels, providing end-to-end verification from low-level isolated functions to full-scale multi-service integration and system resilience.

| Test Level | Scope & Target Components | Execution Mechanism | Expected Evidence & Output |
|:---|:---|:---|:---|
| **1. Unit Tests** | Pure functions, password hashing, JWT signing/verifying, rule-based AI heuristic, input sanitizers. | Node.js native test runner (`node:test`, `node:assert/strict`) via `npm test --prefix <service>` | Summary of test passes/failures, zero unhandled rejections, code coverage report. |
| **2. Integration Tests** | Database repositories, Sequelize models, PostGIS queries, migration scripts. | Service test suites interacting with isolated PostgreSQL test schemas. | Successful CRUD records, PostGIS spatial query validation, schema migration logs. |
| **3. API & Contract Tests** | API Gateway reverse-proxy routes, HTTP response headers, status codes, JSON payload schemas. | Gateway integration tests (`npm run test:gateway`), HTTP client assertion suites. | Verified HTTP status codes (200, 201, 400, 401, 403, 404, 502), response time stamps. |
| **4. End-to-End (E2E) Tests** | Multi-service user journeys across Gateway, Auth, Users, Fishing, Social, Chat, Weather, AI. | `node scripts/verify-e2e-runtime.js` | 13 completed user flow assertions, consistent data state, zero orphaned database rows. |
| **5. Security & Privacy Tests** | Role-based access control, spot visibility tiers, secret masking, token expiration, injection defense. | Security test suites (`tokens-and-passwords.test.js`, `validation-and-rate-limit.test.js`), `npm audit`. | Rejection of unauthorized requests (401/403), zero plaintext secrets in logs/DB, 0 critical CVEs. |
| **6. Performance & Load Tests** | Request latency (p50/p95/p99), system throughput (RPS), concurrent connection scalability. | Recommended tooling: `autocannon` or `k6` executing 50 concurrent virtual users. | Latency distribution percentiles, requests/sec, error rate, CPU/memory profiling logs. |
| **7. Reliability & Resilience Tests** | External dependency outages (Open-Meteo, Gemini), database connection drops, health checks. | `node scripts/health-check.js`, `health-and-errors.test.js`, AbortController timeout simulation. | Automated fallback to mock/rule providers, graceful HTTP 502/503 errors, rapid crash recovery. |

### 2.1 Unit Testing
- **Objective:** Verify that isolated modules, algorithms, data validation rules, and error-handling utilities behave correctly without external side effects or network dependencies.
- **Components to Test:**
  - Password hashing and verification algorithms (`bcryptjs` salt rounds).
  - JWT token generation, payload expiration verification, and signature tampering rejection.
  - Deterministic rule-based lure recommendation heuristics in `backend/services/ai/src/providers/rule-based.provider.js`.
  - Solunar and barometric bite rating calculations in `backend/services/weather/src/services/weather.service.js`.
  - Coordinate and spatial input validation logic (latitude bounds $[-90, 90]$, longitude bounds $[-180, 180]$).
- **Execution:**
  ```bash
  # Run unit test suites for all services
  npm test
  ```
- **Evidence:** Clean test reporter output with zero test failures and explicit assert confirmations.

### 2.2 Integration Testing (Database & Service Layer)
- **Objective:** Confirm that Sequelize ORM models, repository layers, and database migrations interact reliably with the PostgreSQL 16 and PostGIS 3.4 engine.
- **Components to Test:**
  - PostGIS spatial operations: `ST_DWithin`, `ST_MakePoint`, `ST_SetSRID` (EPSG:4326) in `FishingSpot` repository.
  - Foreign key cascades and relational integrity across users, spots, catches, comments, and messages.
  - Sequelize schema migrations executed in sequence via `scripts/db-migrate-all.js`.
- **Execution:**
  ```bash
  # Verify database container health and execute migrations
  npm run infra:status
  npm run db:migrate:all
  npm run test:fishing
  ```
- **Evidence:** Successful database migrations across all 6 service databases without constraint violations.

### 2.3 API and Contract Testing (Gateway Routing)
- **Objective:** Validate that the API Gateway correctly maps public client requests to target microservices and enforces standard HTTP headers and error structures.
- **Components to Test:**
  - Route routing table in `backend/gateway/src/routes/proxy.routes.js`:
    - `/api/v1/auth/*` &rarr; Auth Service (`:4001`)
    - `/api/v1/users/*` &rarr; Users Service (`:4002`)
    - `/api/v1/fishing/*` &rarr; Fishing Service (`:4003`)
    - `/api/v1/inventory/*` &rarr; Inventory Service (`:4004`)
    - `/api/v1/social/*` &rarr; Social Service (`:4005`)
    - `/api/v1/chat/*` &rarr; Chat Service (`:4006`)
    - `/api/v1/weather/*` &rarr; Weather Service (`:4007`)
    - `/api/v1/ai/*` &rarr; AI Recommendation Service (`:4008`)
  - Reverse proxy header preservation: `Authorization: Bearer <token>`, `Content-Type: application/json`.
  - Gateway health check probe at `GET /health`.
- **Execution:**
  ```bash
  npm run test:gateway
  npm run health:check
  ```
- **Evidence:** Table of health statuses indicating `PASS` and response latencies across all 9 gateway endpoints.

### 2.4 End-to-End (E2E) Scenario Testing
- **Objective:** Verify multi-step business transactions traversing multiple microservices through the gateway.
- **Components to Test:**
  - The 13 end-to-end integration flows implemented in `scripts/verify-e2e-runtime.js`:
    1. *User Registration & Login:* Register two test anglers, authenticate, and receive signed JWT access/refresh tokens.
    2. *Protected Endpoint Access:* Query user profiles with valid authorization headers.
    3. *Token Lifecycle:* Refresh access tokens and revoke refresh tokens.
    4. *Profile Management:* Update angler display bio, avatar, and experience level.
    5. *Geospatial Spot Marking:* Create fishing spot with PostGIS coordinates and verify bounding-box retrieval.
    6. *Catch Logging:* Record a catch associated with a spot and retrieve historical entries.
    7. *Tackle Management:* Catalog a rod, reel, and lure in the inventory service.
    8. *Social Engagement:* Create a post, submit comments, and toggle comment likes.
    9. *Friendship Lifecycle:* Send, retrieve, and accept a friend request between two test accounts.
    10. *Direct Messaging:* Create conversation, exchange messages, and update read markers.
    11. *Weather Telemetry:* Query real-time weather and retrieve barometric bite suitability.
    12. *AI Assistant:* Request lure recommendations and verify fallback behavior.
    13. *Angling Analytics:* Query aggregate statistics for personal catches.
- **Execution:**
  ```bash
  node scripts/verify-e2e-runtime.js
  ```
- **Evidence:** Step-by-step confirmation of all 13 flows with zero assertions failed.

### 2.5 Security and Privacy Testing
- **Objective:** Validate that sensitive operations, tokens, personal data, and spot coordinates are protected according to NFR-SEC-01 through NFR-SEC-08.
- **Components to Test:**
  - *Authentication Enforcers:* Validate that missing, expired, or malformed JWT tokens produce `HTTP 401 Unauthorized`.
  - *Privacy Tiers:* Confirm that spots marked with `'private'` visibility cannot be retrieved by unauthorized accounts.
  - *Secret Protection:* Ensure passwords are never returned in JSON responses or written to service log files.
  - *Dependency Vulnerabilities:* Scan npm dependency trees for reported CVEs.
- **Execution:**
  ```bash
  npm audit
  npm run test:auth
  ```
- **Evidence:** Audit report with 0 critical vulnerabilities; automated assertions proving access restriction.

### 2.6 Performance and Load Testing
- **Objective:** Evaluate backend throughput, latency percentiles, and concurrency limits under the 50-user concurrent workload specified in NFR-PERF-01 and NFR-PERF-02.
- **Components to Test:**
  - API Gateway routing overhead under sustained HTTP traffic.
  - PostGIS spatial radius queries (`/api/v1/fishing/spots`) with spatial index lookups.
  - Weather service in-memory cache hit performance versus cache miss external fetches.
  - Concurrent user login and token verification latency.
- **Execution Method (Recommended Tooling):**
  *Note: While unit and E2E tools exist in the repository, dedicated load generators like `autocannon` or `k6` must be executed to collect percentile metrics.*
  ```bash
  # Example load generation using npx autocannon against running API Gateway
  npx autocannon -c 50 -d 60s --warmup [-c 10 -d 10s] http://127.0.0.1:4000/health
  npx autocannon -c 50 -d 60s http://127.0.0.1:4000/api/v1/weather/current?latitude=51.1694&longitude=71.4491
  ```
- **Evidence:** Tabular reports recording p50, p95, p99 latencies, requests/sec, and error counts.

### 2.7 Reliability and Error-Handling Testing
- **Objective:** Verify system resilience when external providers or internal databases experience latency, disconnects, or timeouts.
- **Components to Test:**
  - *External AI Failure:* Simulate Gemini API timeout/offline mode &rarr; verify automatic fallback to `RuleBasedAIProvider` without HTTP 500 error.
  - *External Weather Failure:* Simulate Open-Meteo downtime &rarr; verify fallback to `MockWeatherProvider`.
  - *Downstream Service Disconnect:* Shut down a single microservice &rarr; verify API Gateway returns structured `HTTP 502 Bad Gateway` or `HTTP 504 Gateway Timeout` without leaking internal stack traces.
- **Execution:**
  ```bash
  npm run test:weather
  npm run test:ai
  ```
- **Evidence:** Valid JSON error envelopes matching `{ status: "error", message: "..." }`.

---

## 3. Metrics and Quantitative Indicators

To ensure objective evaluation, every test run records the following quantifiable metrics. No historical measurement values are assumed; actual metrics will be logged during execution.

### 3.1 Verification Metrics Table

| Metric Category | Metric Name | Definition & Measurement Unit | Measurement Mechanism |
|:---|:---|:---|:---|
| **Test Execution** | **Test Pass Rate** | $\frac{\text{Passed Tests}}{\text{Total Tests}} \times 100\%$ | Node.js test runner report summary (`node --test`). |
| | **Failure Count** | Total number of failed test assertions. | Summary error count in test suite output. |
| **Code Coverage** | **Line Coverage** | Percentage of executable code lines covered by tests. | `node --test --experimental-test-coverage`. |
| | **Branch Coverage** | Percentage of logical decision branches evaluated. | `node --test --experimental-test-coverage`. |
| **Latency** | **Median Latency (p50)** | 50th percentile request completion time (ms). | Load testing harness (e.g., `autocannon` / `k6`). |
| | **95th Percentile (p95)** | 95% of requests complete within this duration (ms). | Target: $\le 500$ ms for DB queries, $\le 1000$ ms for PostGIS. |
| | **99th Percentile (p99)** | Tail latency experienced by 1% of requests (ms). | Evaluated to detect garbage collection or lock contention. |
| **Throughput** | **Requests per Second (RPS)** | Total completed HTTP requests divided by test duration. | Load generator output under 50 concurrent virtual users. |
| **Reliability** | **HTTP Error Rate** | $\frac{\text{Failed Requests (4xx/5xx)}}{\text{Total Requests}} \times 100\%$ | Benchmark summary report. Target: $\le 0.1\%$ under load. |
| **Resource Usage** | **CPU Utilization** | Average percentage of CPU consumed per container/process. | `docker stats --no-stream` or OS performance counters. |
| | **Memory Footprint (RSS)** | Resident Set Size (RAM) in megabytes per microservice. | `process.memoryUsage().rss` logged at intervals. |
| **Database** | **Spatial Query Latency** | Execution time of PostGIS indexing queries (ms). | PostgreSQL `EXPLAIN ANALYZE` or Sequelize query duration logs. |

---

## 4. Measurement Conditions and Test Environment

To guarantee reproducible evaluation, all verification runs must adhere to standardized environmental configurations.

### 4.1 Software & Hardware Baseline Specification

- **Host Operating System:** Windows 11 / Linux (Ubuntu 22.04 LTS recommended for CI).
- **Runtime Environment:** Node.js (v20 LTS or v24 LTS as verified in environment: `v24.12.0`).
- **Container Engine:** Docker Engine v24+ with Docker Compose v2.x.
- **Database Engine:** `postgis/postgis:16-3.4-alpine` (PostgreSQL 16.2, PostGIS 3.4.2).
- **Hardware Profile:**
  - CPU: Minimum 4 physical cores (8 threads recommended for concurrent microservices).
  - RAM: Minimum 8 GB available memory.
  - Storage: Solid State Drive (NVMe/SSD) for consistent database I/O performance.

### 4.2 Configuration and Secret Handling
- **Isolation Rule:** All testing must execute using non-production configuration files. Real passwords, production API keys, and sensitive tokens are strictly prohibited.
- **Configuration File:** Driven by `.env.example` templates across root and services:
  - `POSTGRES_USER=postgres`
  - `DB_PASSWORD=fishmap_test_password_non_prod`
  - `POSTGRES_PORT=5434` (host mapping to container port 5432)
  - `JWT_ACCESS_SECRET=fishmap-test-jwt-access-secret-minimum-32b`
  - `JWT_REFRESH_SECRET=fishmap-test-jwt-refresh-secret-minimum-32b`
  - `GEMINI_API_KEY=` (left empty during offline/fallback testing to verify deterministic behavior).

### 4.3 Test Dataset Preparation
- **Deterministic Synthetic Data:**
  - All automated test user accounts must use the pattern `angler_<timestamp>@test.fishmap.io`.
  - Coordinates must use verified geographical boundaries across Kazakhstan (e.g., Astana: `51.1694, 71.4491`, Balkhash: `46.8400, 74.9800`, Kapchagay: `43.8767, 77.0667`).
  - Regional sportfish catalog items from [`frontend/flutter_app/lib/features/fishing/data/fish_catalog.dart`](../frontend/flutter_app/lib/features/fishing/data/fish_catalog.dart) (e.g., `carp_sazan`, `zander_sudak`, `northern_pike`).
- **Data Cleanup:** Test runners must perform schema rollback or truncate test data upon completion to prevent volume bloating.

### 4.4 Load Profile Specification
For performance benchmarks:
- **Concurrency:** 50 virtual users (VUs) issuing continuous requests.
- **Warm-Up Phase:** 30 seconds of ramp-up to prime JIT compiler optimization, connection pools, and in-memory caches.
- **Measurement Phase:** 120 seconds of sustained steady-state load.
- **Iteration Count:** 3 consecutive runs; results reported as arithmetic mean and standard deviation.

---

## 5. Baseline Solution and Comparison Methodology

### 5.1 Baseline Definition
The official baseline solution is defined as the current FishMap backend implementation on the `main` branch at the exact commit:
- **Baseline Git Commit:** `f0560f9651e54346d66b147a7b784ab5580ac324`
- **Commit Title:** `Merge pull request #20 from ataniyaz66/FIS-20-component-diagram`
- **Architecture State:** 8 Node.js/Express microservices, API Gateway reverse proxy, PostgreSQL 16 + PostGIS 3.4 container, in-memory weather caching, dual-engine Gemini/rule-based AI service.

*Note on Historical Data:* Prior to FIS-21, no empirical benchmark metrics existed in the repository. The first formal benchmark execution conducted under this plan will establish the permanent numerical baseline.

### 5.2 Comparative Analysis Protocol
When evaluating subsequent pull requests or optimization candidates:
1. **Identical Conditions:** Deploy candidate code on the same hardware environment, database volume size, and network state as the baseline.
2. **Delta Calculation:**
   $$\Delta\% = \frac{\text{Candidate Value} - \text{Baseline Value}}{\text{Baseline Value}} \times 100\%$$
   - *Latency ($\Delta\%$):* Negative values indicate improvement (faster response times).
   - *Throughput ($\Delta\%$):* Positive values indicate improvement (higher capacity).
   - *Resource Footprint ($\Delta\%$):* Negative values indicate efficiency gains.
3. **Regression Thresholds:** Any candidate pull request that increases p95 latency by $>10\%$ or causes test failures is flagged as a regression.

---

## 6. Acceptance Criteria

To determine whether the backend achieves release readiness, verification outcomes must meet the following pass/fail thresholds.

### 6.1 Functional Acceptance Criteria
- [ ] **Unit & Integration Suites:** 100% pass rate across all 8 microservices and API Gateway (`0 failures, 0 errors`).
- [ ] **E2E Scenario Audit:** All 13 flows in `scripts/verify-e2e-runtime.js` complete with exit code 0.
- [ ] **Health Probes:** `node scripts/health-check.js` confirms all 9 endpoints return HTTP 200 `PASS` status.
- [ ] **Database Migrations:** `node scripts/db-migrate-all.js` executes cleanly without rollbacks.

### 6.2 Security & Data Protection Acceptance Criteria
- [ ] **Vulnerability Audit:** `npm audit` reports 0 high or critical security vulnerabilities.
- [ ] **Authentication Enforcement:** 100% of unauthenticated requests to protected `/api/v1/*` routes receive HTTP 401.
- [ ] **Credential Protection:** Zero plaintext passwords stored in database tables; zero secret keys leaked in error responses.
- [ ] **Private Spot Privacy:** Spot coordinates with `'private'` visibility remain inaccessible to non-owner test accounts.

### 6.3 Performance Acceptance Criteria (Target Thresholds from FIS-19)
- [ ] **Standard Endpoint Latency (NFR-PERF-01):** Under 50 concurrent virtual users, 95% of standard database-backed API requests complete within $\le 500$ ms.
- [ ] **Geospatial Search Latency (NFR-PERF-02):** Under 50 concurrent virtual users, 95% of radius and bounding box queries complete within $\le 1000$ ms.
- [ ] **Throughput Stability (NFR-PERF-03):** Zero unhandled crashes, socket hang-ups, or data corruption under peak 50-user load.
- [ ] **HTTP Error Rate:** Total HTTP 5xx responses $\le 0.1\%$ during full load tests.

---

## 7. Execution Workflow and Results Reporting

### 7.1 Practical Execution Sequence

To execute the verification plan, follow this sequential procedure using verified repository commands:

```bash
# ==============================================================================
# PHASE 1: INFRASTRUCTURE & DATABASE INITIALIZATION
# ==============================================================================
# 1. Start the PostgreSQL 16 + PostGIS 3.4 database container
npm run infra:up

# 2. Verify container health status
npm run infra:status

# 3. Execute database migrations across all 6 persistence services
npm run db:migrate:all

# ==============================================================================
# PHASE 2: STATIC & UNIT TEST VERIFICATION
# ==============================================================================
# 4. Check dependencies for security vulnerabilities
npm audit

# 5. Run unit and service-level integration tests across all microservices
npm test

# ==============================================================================
# PHASE 3: RUNTIME HEALTH & END-TO-END SCENARIO VERIFICATION
# ==============================================================================
# 6. Execute the full end-to-end integration scenario suite (13 user journeys)
node scripts/verify-e2e-runtime.js

# 7. Start the multi-service development environment in background or separate shell
npm run dev:all:nowatch

# 8. Verify all 9 services respond to health probes
npm run health:check

# ==============================================================================
# PHASE 4: PERFORMANCE BENCHMARKING (WHEN BENCHMARK TOOL IS INSTALLED)
# ==============================================================================
# 9. Execute HTTP load benchmark against API Gateway (50 VUs, 60s)
# npx autocannon -c 50 -d 60s http://127.0.0.1:4000/health
```

### 7.2 Results Reporting Template

Results from baseline and candidate evaluation runs must be recorded using the standardized template below:

| Metric Category | Target Indicator | Baseline (`f0560f9`) | Candidate Run | Delta ($\Delta\%$) | Pass/Fail Status |
|:---|:---|:---:|:---:|:---:|:---:|
| **Functional Tests** | Service Unit Tests Pass Rate | *TBD (first run)* | — | — | — |
| | E2E Runtime Scenarios (13/13) | *TBD (first run)* | — | — | — |
| | Health Probes (9/9 Online) | *TBD (first run)* | — | — | — |
| **Code Coverage** | Average Line Coverage (%) | *TBD (first run)* | — | — | — |
| | Branch Coverage (%) | *TBD (first run)* | — | — | — |
| **Latency (p50)** | Gateway `/health` (ms) | *TBD (first run)* | — | — | — |
| | Weather Telemetry (ms) | *TBD (first run)* | — | — | — |
| | PostGIS Radius Query (ms) | *TBD (first run)* | — | — | — |
| **Latency (p95)** | Standard DB Request ($\le 500$ ms) | *TBD (first run)* | — | — | — |
| | Geospatial Query ($\le 1000$ ms) | *TBD (first run)* | — | — | — |
| **Throughput** | Max Sustained RPS (req/s) | *TBD (first run)* | — | — | — |
| **Reliability** | HTTP Error Rate ($\le 0.1\%$) | *TBD (first run)* | — | — | — |
| **Security** | `npm audit` Critical CVEs (0) | *TBD (first run)* | — | — | — |
| | Unauthorized Request Rejection (%) | 100% | — | — | — |

---

## 8. Summary of Tooling Availability & Future Recommendations

| Verification Domain | Current Repository Tooling | Operational Status | Actionable Recommendations |
|:---|:---|:---|:---|
| **Unit & Integration** | `node:test`, `node:assert/strict`, per-service test suites | Fully operational in repository (`npm test`). | Maintain unit tests alongside feature development. |
| **Coverage** | Node.js native `--experimental-test-coverage` | Supported by Node.js runtime. | Add `test:coverage` script to root `package.json`. |
| **E2E Scenarios** | `scripts/verify-e2e-runtime.js` | Fully operational in repository (13 user journeys). | Integrate into pre-merge review workflows. |
| **Health Checks** | `scripts/health-check.js` | Fully operational (`npm run health:check`). | Use as Kubernetes/Docker container readiness probe. |
| **Database Migrations** | `scripts/db-migrate-all.js`, Sequelize CLI | Fully operational (`npm run db:migrate:all`). | Enforce migration testing on clean volumes. |
| **Load Testing** | *None committed in repository* | **Tooling Gap** | Adopt `autocannon` or `k6` script in `scripts/benchmarks/`. |
| **Continuous Integration** | *.github/workflows/ not present* | **Tooling Gap** | Create GitHub Actions workflow to run `npm test` on PRs. |
| **Dynamic Security** | `npm audit` (static dependencies) | Partially operational | Integrate OWASP ZAP or equivalent DAST scanner in staging. |
