# Database Ownership & Schemas

FishMap enforces strict data ownership boundaries: each service exclusively manages its own logical database and migrations. Services never access another service's tables or repositories directly.

## 1. Service Databases

| Service | Database Name | Default User | Spatial Features | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `fishmap_auth` | `fishmap_auth` | None | User credentials, password hashes, refresh tokens |
| **Users** | `fishmap_users` | `fishmap_users` | None | User profiles, avatars, biographies, settings |
| **Fishing** | `fishmap_fishing` | `fishmap_fishing` | PostGIS | Fishing spots, geographic coordinates, catches, sessions, favorites, reports |
| **Inventory** | `fishmap_inventory` | `fishmap_inventory` | None | Tackle, lures, rods, reels, baits, gear inventory |
| **Social** | `fishmap_social` | `fishmap_social` | None | Posts, likes, comments, friendships, notifications |
| **Chat** | `fishmap_chat` | `fishmap_chat` | None | Conversations, direct messages, read receipts |
| **Weather** | `fishmap_weather` | `fishmap_weather` | In-Memory Cache | Weather data and forecasts cache |
| **AI** | `fishmap_ai` | `fishmap_ai` | Stateless / Rules | Recommendation engine and chat assistance |

## 2. Table Specifications by Service

### Auth Service (`fishmap_auth`)
- `auth_users`: `id` (UUID PK), `email` (unique), `username` (unique), `password_hash`, `role`, `is_active`, `is_verified`
- `auth_refresh_tokens`: `id` (UUID PK), `token_hash`, `family_id`, `user_id`, `is_revoked`, `expires_at`
- `auth_password_resets`: `id` (UUID PK), `token_hash`, `user_id`, `is_used`, `expires_at`
- `auth_email_verifications`: `id` (UUID PK), `token_hash`, `user_id`, `is_used`, `expires_at`

### Users Service (`fishmap_users`)
- `user_profiles`: `id` (UUID PK), `auth_user_id` (UUID, unique index), `display_name`, `bio`, `avatar_url`, `location`, `favorite_technique`, `favorite_species`, `is_public`

### Fishing Service (`fishmap_fishing`)
- `fishing_spots`: `id` (UUID PK), `user_id` (UUID), `name`, `description`, `latitude`, `longitude`, `water_type`, `region`, `visibility` (`public`, `friends`, `private`)
- `fishing_sessions`: `id` (UUID PK), `user_id` (UUID), `title`, `started_at`, `ended_at`, `water_conditions`, `weather_summary`, `notes`
- `catches`: `id` (UUID PK), `user_id` (UUID), `spot_id` (UUID FK), `session_id` (UUID FK), `species`, `weight`, `length`, `bait`, `photo_urls` (JSONB), `caught_at`, `visibility`
- `spot_favorites`: `id` (UUID PK), `user_id` (UUID), `spot_id` (UUID FK), unique constraint on `(user_id, spot_id)`
- `spot_reports`: `id` (UUID PK), `user_id` (UUID), `spot_id` (UUID FK), `reason`, `details`, `status`

### Inventory Service (`fishmap_inventory`)
- `inventory_items`: `id` (UUID PK), `user_id` (UUID), `name`, `type` (`lure`, `rod`, `reel`, `line`, `hook`, `box`, `accessory`), `quantity`, `description`, `brand`, `color`, `weight_grams`, `photo_url`, `notes`, `visibility` (`private`, `friends`, `public`)

### Social Service (`fishmap_social`)
- `posts`: `id` (UUID PK), `user_id` (UUID), `content`, `photo_urls` (JSONB), `spot_id` (UUID), `catch_id` (UUID), `visibility` (`public`, `friends`, `private`)
- `comments`: `id` (UUID PK), `post_id` (UUID FK), `user_id` (UUID), `content`
- `likes`: `id` (UUID PK), `post_id` (UUID FK), `user_id` (UUID), unique constraint on `(post_id, user_id)`
- `friendships`: `id` (UUID PK), `requester_id` (UUID), `addressee_id` (UUID), `status` (`pending`, `accepted`, `declined`, `blocked`), unique constraint on `(requester_id, addressee_id)`
- `notifications`: `id` (UUID PK), `user_id` (UUID), `actor_id` (UUID), `type` (`friend_request`, `friend_accept`, `post_like`, `post_comment`), `entity_id` (UUID), `read` (boolean)

### Chat Service (`fishmap_chat`)
- `conversations`: `id` (UUID PK), `participant_1_id` (UUID), `participant_2_id` (UUID), `last_message_at`, unique constraint on `(participant_1_id, participant_2_id)`
- `messages`: `id` (UUID PK), `conversation_id` (UUID FK), `sender_id` (UUID), `content`, `read` (boolean), `read_at`

## 3. Local Development & Docker Compose

A PostGIS-enabled PostgreSQL 16 container runs locally via `docker compose up -d postgres`.
- **Host Port:** `5434` (mapped to container port `5432` to avoid conflicts with native PostgreSQL instances).
- **Initialization Script:** `infrastructure/postgres/init-databases.sh` mounts to `/docker-entrypoint-initdb.d/`. On initial container startup, it automatically provisions all service users, databases, privileges, and enables the PostGIS extension for `fishmap_fishing`.
- **Volume:** `fishmap_postgres_data` persists data safely.

## 4. Migration Commands

Each service uses `sequelize-cli` to execute its migrations:

```bash
# Auth Service
npm run db:migrate --prefix backend/services/auth

# Users Service
npm run db:migrate --prefix backend/services/users

# Fishing Service
npm run db:migrate --prefix backend/services/fishing

# Inventory Service
npm run db:migrate --prefix backend/services/inventory

# Social Service
npm run db:migrate --prefix backend/services/social

# Chat Service
npm run db:migrate --prefix backend/services/chat
```
