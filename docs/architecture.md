# Architecture

FishMap is a monorepo containing independently runnable backend services and a Flutter frontend. The frontend will communicate with backend capabilities through the API Gateway once the Gateway phase begins; the Gateway does not contain domain business logic.

## Current backend boundary

The Auth Service is the first implemented service. It owns credentials, authentication token lifecycle, and its Auth-specific PostgreSQL schema. Its internal dependency flow is:

`routes -> controllers -> services -> repositories -> Auth-owned database`

Controllers do not access database models or Sequelize directly. No other service may access Auth repositories or tables directly; future cross-service needs use defined APIs or events.

For local development, the Auth Service is independently runnable and connects to PostgreSQL using environment configuration. The initial `auth_users` schema is isolated in the `fishmap_auth` database and managed with Auth Service migrations.
