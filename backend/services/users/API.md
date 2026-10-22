# Users Service API

Base URL: `http://localhost:4002`

The Users Service owns user profile information, display names, biographies, avatars, general locations, and profile privacy preferences. It does not store passwords or authentication tokens.

## Endpoints

### `GET /health`

Returns the service health status.

```json
{
  "service": "users",
  "status": "ok"
}
```

### `GET /api/v1/users/me`

Retrieves the authenticated user's profile. If no profile exists yet, one is automatically and idempotently initialized.

**Headers:** `Authorization: Bearer <access-token>` or `X-User-Id: <uuid>`

**Response (`200 OK`):**

```json
{
  "data": {
    "id": "uuid",
    "authUserId": "uuid",
    "displayName": "Captain Bob",
    "bio": "Passionate bass fisherman from Florida",
    "avatarUrl": "https://example.com/avatar.jpg",
    "location": "Orlando, FL",
    "isPublic": true,
    "createdAt": "2026-10-21T12:00:00.000Z",
    "updatedAt": "2026-10-21T12:00:00.000Z"
  }
}
```

### `PATCH /api/v1/users/me`

Updates the authenticated user's profile.

**Headers:** `Authorization: Bearer <access-token>`

**Request Body (all fields optional):**

```json
{
  "displayName": "Captain Bob",
  "bio": "Updated biography",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "location": "Tampa, FL",
  "isPublic": true
}
```

**Response (`200 OK`):** Updated profile object.

### `GET /api/v1/users`

Lists public profiles with pagination.

**Query Parameters:**
- `limit` (optional, default: 20, max: 100)
- `offset` (optional, default: 0)

**Response (`200 OK`):**

```json
{
  "data": [ ... ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### `GET /api/v1/users/:id`

Retrieves a user profile by ID. If the requesting user is the profile owner, full details are returned. If another user requests a public profile, public fields are returned. If the profile is private and requested by another user, returns `404 NOT_FOUND`.

**Response (`200 OK`):** Profile object.
