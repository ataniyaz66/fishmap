# FishMap System Architecture

FishMap is designed as a modular, domain-driven microservices architecture within a monorepo, paired with a future cross-platform Flutter frontend.

## 1. System Overview

```
                      +-----------------------------+
                      |   Client (Flutter App /     |
                      |   Future Web Client)        |
                      +--------------+--------------+
                                     |
                                     | HTTP / JSON (Port 4000)
                                     v
                      +-----------------------------+
                      |      API Gateway            |
                      +--------------+--------------+
                                     |
    +-------+-------+--------+-------+-------+-------+--------+-------+
    |       |       |        |       |       |       |        |       |
    v       v       v        v       v       v       v        v       v
+-------++-------++-------++-------++-------++-------++-------++-------+
| Auth  || Users ||Fishing|| Inven ||Social || Chat  ||Weather||  AI   |
| (4001)|| (4002)|| (4003)|| (4004)|| (4005)|| (4006)|| (4007)|| (4008)|
+---+---++---+---++---+---++---+---++---+---++---+---++---+---++---+---+
    |        |        |        |        |        |        |        |
    v        v        v        v        v        v        v        v
 [Auth]   [Users] [Fishing] [Inven]  [Social]  [Chat] [Weather]  [AI]
 (DB)     (DB)   (PostGIS)   (DB)      (DB)     (DB)   (Cache) (Rules/LLM)
```

## 2. Architectural Boundaries & Data Isolation

1. **API Gateway (Port 4000):** Stateless single entry-point for clients. Routes requests by prefix:
   - `/api/v1/auth/*` -> Auth Service (4001)
   - `/api/v1/users/*` -> Users Service (4002)
   - `/api/v1/fishing/*` -> Fishing Service (4003)
   - `/api/v1/inventory/*` -> Inventory Service (4004)
   - `/api/v1/social/*` -> Social Service (4005)
   - `/api/v1/chat/*` -> Chat Service (4006)
   - `/api/v1/weather/*` -> Weather Service (4007)
   - `/api/v1/ai/*` -> AI Recommendation Service (4008)
2. **Database-per-Service:** Each service owns its dedicated database schema and credentials. Cross-database foreign keys and cross-repository access are strictly prohibited.
3. **Internal Layering Convention:** Every service implements clean separation of concerns:
   `Routes -> Controllers -> Services -> Repositories -> Database`
   Controllers are forbidden from accessing Sequelize models directly.
4. **Identity & Authorization:** The Auth Service owns credentials, hashing, and token issuance. Other services reference user identities via external UUIDs without foreign keys to `auth_users`. Verified user identity is propagated via JWT Bearer tokens or verified Gateway `x-user-id` headers.

## 3. Standardized Error Response Contract

All microservices return errors matching the unified envelope:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": []
  }
}
```

Standardized Error Codes:
- `VALIDATION_ERROR` (400)
- `INVALID_JSON` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_SERVER_ERROR` (500)
- `BAD_GATEWAY` (502)
