# FishMap API Gateway

The Gateway is the stateless HTTP entry point for client requests. It forwards
requests to backend services and does not implement authentication or business
logic.

## Configuration

Copy `.env.example` to `.env` and configure:

- `PORT` — Gateway listening port (default: `4000`).
- `AUTH_SERVICE_URL` — Auth Service base URL.
- `USERS_SERVICE_URL` — Users Service base URL.

## Endpoints

### `GET /health`

Handled directly by the Gateway:

```json
{
  "service": "gateway",
  "status": "ok"
}
```

### Auth Service proxy

Requests under `/api/v1/auth/*` are forwarded to
`${AUTH_SERVICE_URL}/api/v1/auth/*`.

### Users Service proxy

Requests under `/api/v1/users/*` are forwarded to
`${USERS_SERVICE_URL}/api/v1/users/*`.

The Gateway preserves the HTTP method, query string, and request body.
If a target service cannot be reached, the Gateway returns HTTP `502` with a
JSON error response.
