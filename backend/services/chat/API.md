# FishMap Chat Service API Specification

The Chat Service manages 1-on-1 direct messaging, conversation histories, and read receipts between authenticated anglers.

## Base URL
Through Gateway: `/api/v1/chat`
Direct Service: `http://localhost:4006/api/v1/chat`

## Endpoints

### 1. Conversations
- `POST /conversations` — Start or retrieve existing 1-on-1 conversation.
  - Body: `{ "target_user_id": UUID }`
  - Rejects self-conversations (`400 Bad Request`).
- `GET /conversations` — List current user's conversations ordered by `last_message_at` DESC.

### 2. Messages
- `GET /conversations/:id/messages` — Retrieve paginated messages for conversation.
  - Query: `limit` (default 50, max 100), `offset` (default 0)
  - Authorized participants only (`403 Forbidden` if requester is not a participant).
- `POST /conversations/:id/messages` — Send a message in conversation.
  - Body: `{ "content": string }`
  - Updates `last_message_at` on conversation.
- `POST /conversations/:id/read` — Mark incoming unread messages as read.
