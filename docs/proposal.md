# Project Proposal

## 1. Project title

**Development of a Cross-Platform Intelligent System for Planning, Tracking and Analyzing Recreational Fishing** (FishMap)

- RU: Разработка кроссплатформенной интеллектуальной системы для планирования, отслеживания и анализа любительской рыбалки
- KZ: Әуесқой балық аулауды жоспарлауға, бақылауға және талдауға арналған кроссплатформалық зияткерлік жүйені әзірлеу

## 2. Team and supervisor

| Member | Responsibility |
|---|---|
| Bibifatima Biysheva | UI/UX design, cross-platform client application, fish species recognition model from a photo, participation in personalized recommendations, client–backend and AI integration, client testing, user documentation |
| Ataniyaz Mutigolla | Server architecture (API Gateway and domain microservices), database design (per-service logical databases and PostGIS spatial storage), authentication and authorization, domain REST APIs (profiles, spots, catches, inventory, social features, chat), external service integrations (weather and AI assistance), backend testing, technical documentation |

**Supervisor:** Alua Myrzakerimova

## 3. Problem statement

Recreational anglers use several unrelated tools during their activity: notes or messengers for fishing spots, galleries for catch photos, separate sources for weather and fishing regulations, and general-purpose chats for communication. This leads to the following problems:

- Information about spots and catches is scattered and hard to search or analyze.
- Anglers have no convenient way to see their own results over time (number of catches, species, best places and seasons).
- Beginners find it difficult to identify a caught fish and to know the applicable restrictions (seasons, protected species, size and catch limits).
- Finding other anglers and sharing spots, catches or trips requires separate communication channels.

*Note: the statements above are initial assumptions. They will be checked through user interviews and an analysis of existing applications (see `relevance-evidence.md` and `system-comparison.md`); verified findings will be marked separately from assumptions.*

## 4. Target users

- **Amateur anglers** who want to keep records of spots, catches and equipment.
- **Groups of friends** who fish together and share spots, catches and trips.
- **Beginners** who need help identifying fish species and information about fishing rules.

## 5. Aim

To develop a cross-platform intelligent system that helps anglers plan fishing trips, record catches and equipment, and analyze their fishing results using an interactive map, social features and AI-based functions.

## 6. Objectives

1. Analyze the problem domain: interview potential users and review scientific literature and existing fishing applications.
2. Define functional and non-functional requirements with priorities and acceptance criteria.
3. Design the system architecture, database schemas, and user interface (architectural diagrams, data isolation models, and UI prototypes of key scenarios).
4. Develop the backend architecture and domain services:
   - Implement an API Gateway providing a unified reverse-proxy entry point, request routing, and standardized error response normalization.
   - Implement authentication and access control with password hashing, short-lived JWT access tokens, rotating refresh tokens, and cross-service identity propagation.
   - Design and manage per-service logical databases enforcing data isolation without cross-database foreign keys, employing PostGIS for geospatial data.
   - Develop REST APIs for core domain services: user profiles, fishing spots with geospatial bounding-box and radius queries, fishing sessions, catches, and tackle inventory.
   - Develop social and communication services supporting community posts, comments, likes, friendships, and private direct messaging.
   - Integrate external services: weather forecasting with local in-memory caching and fishing suitability evaluation, and an AI angling assistant with lure recommendations.
5. Develop the client application: interactive map, user profile, catch logging with photos, tackle inventory, social feed, and chat.
6. Develop and integrate intelligent features: a computer vision model for fish species identification from photos, and an AI-driven angling and lure recommendation assistant.
7. Test the system and evaluate the results: execute automated test suites for backend services and the API Gateway, perform client and end-to-end integration testing, and assess accuracy against defined metrics.
8. Prepare technical documentation (architecture, database schema, API contracts) and user documentation.

## 7. Expected outcomes

- A working cross-platform client application with interactive maps, catch recording, tackle management, and social interactions.
- A modular backend architecture featuring an API Gateway and dedicated domain microservices (Auth, Users, Fishing, Inventory, Social, Chat, Weather, and AI).
- A documented and containerized database layer utilizing PostgreSQL 16 with PostGIS, maintaining per-service logical data isolation and migration scripts.
- Secure token-based authentication and authorization with credential hashing and session lifecycle management.
- Integration with external weather services (Open-Meteo API with localized caching and fishing suitability scoring) and external LLM services for angling advice and lure selection.
- A computer vision model capable of classifying fish species from caught fish photographs.
- Comprehensive automated test suites (unit and integration tests for backend services and gateway) and a unified health check verification runner.
- Complete documentation: requirements specification, architecture design, database documentation, API specifications, and user guides stored in the repository.
- Clear separation of individual results allowing independent academic assessment (mobile client and computer vision model by Bibifatima Biysheva; server architecture, data layer, microservices, and integrations by Ataniyaz Mutigolla).

## 8. Project scope

**Planned feature priorities** (to be refined in the requirements specification):

**Must have**
- User registration, authentication, and profile management
- Interactive map and fishing spots with geospatial coordinates, details, and photos
- Catch logging with species, weight/length measurements, bait, session linkage, and photos
- Tackle and lure inventory management with privacy visibility controls
- Cross-platform client application and backend API Gateway with core REST services
- Computer vision model for fish species identification from a photo

**Should have**
- Angler friendships and community social feed (posts, photo sharing, comments, and likes)
- One-on-one direct messaging between anglers
- Meteorological forecast integration (weather conditions and fishing suitability estimation for spot coordinates)
- Conversational AI fishing assistant and lure recommendation matching tackle inventory
- Personal fishing statistics and fishing journal history
- Fishing regulations awareness (seasons, protected species, size and catch limits)
- Notification system for social interactions and friend requests

**Could have**
- Fishing groups, group chats, shared spots, and organized group trips
- Leaderboards, seasonal challenges, and top catches by water body
- Administrative dashboard, user moderation, and report review tools
- Offline data synchronization for spots and catches in remote areas without network connectivity

**Out of scope:** commercial production deployment, public app store publication, real-time massive-scale clustering, and legal certification of fishing regulations across all jurisdictions.

## 9. Engineering complexity

The project combines several non-trivial engineering challenges:

- **Microservices architecture and API Gateway:** Designing a modular monorepo with an API Gateway that abstracts downstream services, standardizes error responses, and handles request routing.
- **Data isolation and persistence:** Enforcing a Database-per-Service model using PostgreSQL 16 without distributed transactions or cross-database foreign keys, relying on external UUIDs for loose coupling.
- **Geospatial querying:** Storing and querying spatial coordinates using PostGIS, supporting efficient bounding-box filtering and radius-based spot searches on interactive maps.
- **Authentication and security:** Implementing token-based authentication with bcrypt credential hashing, short-lived JWT access tokens, rotating refresh tokens with revocation, and secure identity propagation.
- **External integrations and resilience:** Interfacing with third-party APIs (Open-Meteo for meteorological data, Google Gemini for conversational advice) with local caching, timeouts, and fallback mechanisms.
- **Computer vision and AI assistance:** Training and deploying an image classification model for fish species recognition, alongside conversational intelligence tailored to regional water bodies and tackle inventory.
- **Multi-level privacy controls:** Implementing visibility policies (`public`, `friends`, `private`) consistently across fishing spots, catches, equipment, and social posts.

## 10. Risks to scope

| Risk | Mitigation |
|---|---|
| The feature list is large for a team of two | Strict MoSCoW prioritization; social interactions and advanced AI assistance are secondary to core spot and catch tracking |
| Lack of a suitable dataset for fish species recognition | Review existing datasets early; restrict the initial classification scope to common regional species; document accuracy limits |
| Dependence between client and backend development | Define clear API contracts early; maintain independent service mocks and containerized local development environments |

*A full risk register is maintained in `project-management.md`.*
