# FishMap API Gateway

The Gateway is the unified, stateless HTTP entry point for all client requests (mobile app, web, external integrations). It forwards requests to the respective backend microservices, preserving headers, authentication tokens, query strings, and payloads.

## Configuration

Copy `.env.example` to `.env` and configure:

- `PORT` — Gateway listening port (default: `4000`).
- `AUTH_SERVICE_URL` — Auth Service base URL (default: `http://localhost:4001`).
- `USERS_SERVICE_URL` — Users Service base URL (default: `http://localhost:4002`).
- `FISHING_SERVICE_URL` — Fishing Service base URL (default: `http://localhost:4003`).
- `INVENTORY_SERVICE_URL` — Inventory Service base URL (default: `http://localhost:4004`).
- `SOCIAL_SERVICE_URL` — Social Service base URL (default: `http://localhost:4005`).
- `CHAT_SERVICE_URL` — Chat Service base URL (default: `http://localhost:4006`).
- `WEATHER_SERVICE_URL` — Weather Service base URL (default: `http://localhost:4007`).
- `AI_SERVICE_URL` — AI Service base URL (default: `http://localhost:4008`).

## Endpoints

### `GET /health`

Handled directly by the Gateway:

```json
{
  "service": "gateway",
  "status": "ok"
}
```

### Microservice Proxy Routes

- `/api/v1/auth/*` -> Auth Service (`${AUTH_SERVICE_URL}/api/v1/auth/*`)
- `/api/v1/users/*` -> Users Profile Service (`${USERS_SERVICE_URL}/api/v1/users/*`)
- `/api/v1/fishing/*` -> Fishing Spots, Catches, Sessions, Analytics (`${FISHING_SERVICE_URL}/api/v1/fishing/*`)
- `/api/v1/inventory/*` -> Tackle & Gear Inventory (`${INVENTORY_SERVICE_URL}/api/v1/inventory/*`)
- `/api/v1/social/*` -> Posts, Feed, Likes, Comments, Friendships, Notifications (`${SOCIAL_SERVICE_URL}/api/v1/social/*`)
- `/api/v1/chat/*` -> 1-on-1 Direct Messaging & Conversations (`${CHAT_SERVICE_URL}/api/v1/chat/*`)
- `/api/v1/weather/*` -> Real-time weather, forecast, and angling suitability (`${WEATHER_SERVICE_URL}/api/v1/weather/*`)
- `/api/v1/ai/*` -> Intelligent lure recommendation and angling assistance (`${AI_SERVICE_URL}/api/v1/ai/*`)

The Gateway preserves the HTTP method, query string, authorization headers, and request body.
If a target service cannot be reached, the Gateway returns HTTP `502` or `504` with a standardized JSON error response.
