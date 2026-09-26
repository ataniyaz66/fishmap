# Auth Service API Contract

## Scope and base URL

The Auth Service owns credentials and token lifecycle. It does not own user profiles or preferences.

All public auth endpoints are versioned under `/api/v1/auth`. Until the API Gateway is introduced, this service can be run directly for local development. In the production architecture, clients access these endpoints through the API Gateway only.

All request and response bodies use JSON. Requests that include a body must send `Content-Type: application/json`.

## Health

### `GET /health`

Returns service availability without requiring authentication.

Success response (`200`):

```json
{
  "service": "auth",
  "status": "ok"
}
```

## Error format

All API errors use this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email must be a valid email address"
      }
    ]
  }
}
```

`details` is an array. It is populated for validation errors and is otherwise an empty array.

| Code | HTTP status | Meaning |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400 | One or more request fields are missing or invalid. |
| `INVALID_CREDENTIALS` | 401 | Email/username and password combination is invalid. |
| `EMAIL_ALREADY_EXISTS` | 409 | The requested email belongs to an existing account. |
| `USERNAME_ALREADY_EXISTS` | 409 | The requested username is already in use. |
| `INVALID_REFRESH_TOKEN` | 401 | The refresh token is invalid, expired, revoked, or has the wrong purpose. |
| `UNAUTHORIZED` | 401 | A required access token is missing, invalid, or expired. |
| `NOT_FOUND` | 404 | The requested resource or route does not exist. |
| `INTERNAL_ERROR` | 500 | An unexpected server error occurred. |

## Validation rules

Registration requires all of the following fields:

| Field | Rules |
| --- | --- |
| `email` | Required string; must be a valid email address. Email comparison is case-insensitive. |
| `username` | Required string; 3–30 characters; letters, numbers, and underscores only (`^[A-Za-z0-9_]{3,30}$`). Username comparison is case-insensitive. |
| `password` | Required string; at least 8 characters. The password is never returned in a response or logged. |

Login requires a non-empty `email` or `username` identifier and a non-empty `password`. Refresh and logout require a non-empty `refreshToken`.

Unknown request fields are ignored for forward compatibility. Clients should send only fields documented here.

## Endpoints

### `POST /api/v1/auth/register`

Creates an account.

Request:

```json
{
  "email": "angler@example.com",
  "username": "river_angler",
  "password": "a-long-secret-password"
}
```

Success response (`201`):

```json
{
  "user": {
    "id": "uuid",
    "email": "angler@example.com",
    "username": "river_angler",
    "status": "active",
    "createdAt": "2026-09-11T12:00:00.000Z"
  }
}
```

Failure responses: `400 VALIDATION_ERROR`, `409 EMAIL_ALREADY_EXISTS`, `409 USERNAME_ALREADY_EXISTS`, `500 INTERNAL_ERROR`.

### `POST /api/v1/auth/login`

Authenticates an existing account. `email` and `username` are alternatives; exactly one should be supplied.

Request using email:

```json
{
  "email": "angler@example.com",
  "password": "a-long-secret-password"
}
```

Request using username:

```json
{
  "username": "river_angler",
  "password": "a-long-secret-password"
}
```

Success response (`200`):

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "tokenType": "Bearer",
  "accessTokenExpiresIn": 900,
  "refreshTokenExpiresIn": 2592000,
  "user": {
    "id": "uuid",
    "email": "angler@example.com",
    "username": "river_angler",
    "status": "active"
  }
}
```

Failure responses: `400 VALIDATION_ERROR`, `401 INVALID_CREDENTIALS`, `500 INTERNAL_ERROR`.

### `POST /api/v1/auth/refresh`

Rotates a valid refresh token and issues a new access and refresh token pair.

Request:

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

Success response (`200`):

```json
{
  "accessToken": "new-jwt-access-token",
  "refreshToken": "new-jwt-refresh-token",
  "tokenType": "Bearer",
  "accessTokenExpiresIn": 900,
  "refreshTokenExpiresIn": 2592000
}
```

Failure responses: `400 VALIDATION_ERROR`, `401 INVALID_REFRESH_TOKEN`, `500 INTERNAL_ERROR`.

### `POST /api/v1/auth/logout`

Revokes a refresh token. This endpoint is idempotent: an unknown, expired, or previously revoked token still produces a successful response, preventing token-state disclosure.

Request:

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

Success response (`204`): no response body.

Failure responses: `400 VALIDATION_ERROR`, `500 INTERNAL_ERROR`.

## Authentication strategy

Phase 5 implements this contract with JWTs:

- Access tokens are short-lived Bearer tokens (initial target: 15 minutes) and are sent in the `Authorization: Bearer <access-token>` header.
- Refresh tokens are long-lived (initial target: 30 days), carry a distinct `purpose` claim, and are accepted only by the refresh/logout flows.
- Each refresh rotates the token pair. Refresh-token records are retained in Auth-owned storage so they can be revoked.
- Signing secrets, token lifetimes, and issuer/audience configuration come exclusively from environment variables; they are never hardcoded or committed.
- Passwords are hashed before persistence and password hashes are never included in API responses.

## Current implementation status

`GET /health` is implemented. The four auth endpoints are currently intentional `501 Not Implemented` placeholders while PostgreSQL, password hashing, JWT issuance, and refresh-token persistence are completed in later phases. Their final success and failure formats will conform to this contract.
