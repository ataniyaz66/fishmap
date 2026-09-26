# FishMap Inventory Service

Inventory manages a user's fishing lures, baits, and tackle. It runs on
`http://localhost:4004` and uses its own PostgreSQL database.

JWT authentication is not implemented. **Temporary local-development behavior:**
the API accepts `user_id` in the create request body, and accepts it as a query
parameter for listing and ownership checks. This is not trusted authentication
and must not be used in production; the future Gateway/Auth integration must
provide a verified identity.

## Start

Copy `.env.example` to `.env`, then run `npm install`, `npm run db:migrate`, and
`npm start`.

## Health

`GET /health`

```json
{
  "service": "inventory",
  "status": "ok"
}
```

## Endpoints

All inventory routes are under `/api/v1/inventory`.

### `POST /api/v1/inventory/items`

Creates an item. `user_id`, `name`, and `type` are required. `quantity`
defaults to `0`; `visibility` defaults to `private`.

```json
{
  "userId": "11111111-1111-1111-1111-111111111111",
  "name": "Blue Spinner",
  "type": "lure",
  "quantity": 5,
  "description": "Test fishing lure",
  "brand": "TestBrand",
  "visibility": "private"
}
```

Returns HTTP `201`:

```json
{
  "data": {
    "id": "generated-uuid",
    "user_id": "11111111-1111-1111-1111-111111111111",
    "name": "Blue Spinner",
    "type": "lure",
    "quantity": 5,
    "description": "Test fishing lure",
    "brand": "TestBrand",
    "visibility": "private",
    "createdAt": "2026-09-26T10:00:00.000Z",
    "updatedAt": "2026-09-26T10:00:00.000Z"
  }
}
```

### `GET /api/v1/inventory/items?user_id=UUID`

Lists the requesting user's items. Returns HTTP `200` and `{ "data": [...] }`.

### `GET /api/v1/inventory/items/:id?user_id=UUID`

Gets an owned item. Returns HTTP `200` and `{ "data": { ... } }`. An item not
owned by that user returns `404`.

### `PATCH /api/v1/inventory/items/:id?user_id=UUID`

Updates one or more of `name`, `type`, `quantity`, `description`, `brand`, and
`visibility`. Returns HTTP `200` and `{ "data": { ... } }`.

```json
{
  "quantity": 6,
  "visibility": "friends"
}
```

### `DELETE /api/v1/inventory/items/:id?user_id=UUID`

Deletes an owned item and returns HTTP `204`.

Invalid input returns HTTP `400`; missing or non-owned items return HTTP `404`.
Unexpected server errors return a generic JSON `500` response.
