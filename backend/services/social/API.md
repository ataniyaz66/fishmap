# FishMap Social Service API Specification

The Social Service manages the angler community feed, multimedia posts, likes, comments, friendship relationships, and in-app notifications.

## Base URL
Through Gateway: `/api/v1/social`
Direct Service: `http://localhost:4005/api/v1/social`

## Endpoints

### 1. Posts & Community Feed
- `GET /posts` — Retrieve community feed. Public posts visible to all; friends-only posts visible if requester is a friend of author.
  - Query: `limit` (default 20, max 50), `offset` (default 0)
- `POST /posts` — Create a post. Requires Bearer Token.
  - Body: `{ "content": string, "photo_urls": string[], "spot_id"?: UUID, "catch_id"?: UUID, "visibility": "public"|"friends"|"private" }`
- `GET /posts/:id` — Retrieve post by ID.
- `PATCH /posts/:id` — Update post content or visibility. Author only.
- `DELETE /posts/:id` — Delete post. Author only.
- `GET /posts/user/:userId` — Retrieve posts by a specific user.

### 2. Interactions (Likes & Comments)
- `POST /posts/:id/like` — Toggle like on post. Sends notification to author if not self.
- `GET /posts/:id/comments` — List comments on post with pagination.
- `POST /posts/:id/comments` — Add comment to post.
  - Body: `{ "content": string }`
- `DELETE /posts/comments/:commentId` — Delete comment (comment author or post owner only).

### 3. Friendships
- `POST /friends/request` — Send friend request.
  - Body: `{ "addressee_id": UUID }`
- `POST /friends/accept/:id` — Accept friend request.
- `POST /friends/decline/:id` — Decline friend request.
- `POST /friends/block` — Block user.
  - Body: `{ "target_user_id": UUID }`
- `GET /friends` — List accepted friends.
- `GET /friends/requests` — List pending incoming friend requests.

### 4. Notifications
- `GET /notifications` — List notifications with pagination and unread count.
- `GET /notifications/unread-count` — Get total unread notifications count.
- `PATCH /notifications/:id/read` — Mark a notification as read.
- `POST /notifications/read-all` — Mark all notifications as read.
