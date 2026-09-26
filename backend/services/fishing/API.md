# FishMap Fishing Service API

Base URL: `http://localhost:4003`

## Local setup

Copy `.env.example` to `.env`, configure `FISHING_DATABASE_URL` for the
FishMap Fishing database, then run:

```sh
npm install
npm run db:migrate
npm start
```

## Temporary development identity

JWT validation is not implemented. For local development only, provide
`user_id` in the JSON request body when creating a fishing spot or catch.
This value is trusted by the service solely to allow local API testing. It is
not secure and must not be trusted in production. Production identity must
come from authenticated Gateway/Auth integration. This service stores
`user_id` as an external UUID and does not create cross-service foreign keys.

## Endpoints

### `GET /health`

Returns `{"service":"fishing","status":"ok"}` without requiring a database
connection.

### Fishing spots

- `POST /api/v1/fishing/spots` — create a spot. Required: `user_id`, `name`,
  `latitude`, `longitude`. Optional: `description`, `water_type`.
- `GET /api/v1/fishing/spots` — list spots.
- `GET /api/v1/fishing/spots/:id` — get a spot.
- `PATCH /api/v1/fishing/spots/:id` — update supplied spot fields.
- `DELETE /api/v1/fishing/spots/:id` — delete a spot and its catches.

### Catches

- `POST /api/v1/fishing/spots/:spotId/catches` — create a catch. Required:
  `user_id`, `species`, `caught_at`. Optional: `weight`, `length`, `bait`,
  `notes`.
- `GET /api/v1/fishing/spots/:spotId/catches` — list catches for a spot.
- `GET /api/v1/fishing/catches/:id` — get a catch.
- `PATCH /api/v1/fishing/catches/:id` — update supplied catch fields.
- `DELETE /api/v1/fishing/catches/:id` — delete a catch.

Successful creation returns HTTP `201`; reads and updates return HTTP `200`;
deletes return HTTP `204`. Invalid input returns HTTP `400`, missing resources
return HTTP `404`, and unexpected errors return a generic JSON `500` response.
