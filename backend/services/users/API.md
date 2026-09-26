# Users Service API

Base URL: `http://localhost:4002`

## Implemented

### `GET /health`

Returns the service health status. This endpoint does not require a database
connection.

```json
{
  "service": "users",
  "status": "ok"
}
```

## Planned

The following profile endpoints are reserved for a future implementation:

- `GET /api/v1/users/:id` — retrieve a user profile.
- `PATCH /api/v1/users/:id` — update a user profile.

Authentication credentials, passwords, login, registration, and tokens belong
to the Auth Service and are outside the responsibility of this service.
The Auth Service user ID will be stored as an external identifier; no database
foreign key to Auth Service tables will be created.
