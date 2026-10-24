# FIS-18: Comparison of Backend Technologies

**Author:** Ataniyaz Mutigolla  
**Project:** FishMap — Cross-Platform Social Network for Anglers  
**Task:** FIS-18 — Compare technologies: backend platform, database, API interaction

## 1. Introduction

FishMap is a cross-platform application for recreational anglers. It is intended to provide user authentication, profiles, fishing-spot maps, catch records, tackle inventory, friendships, posts, comments, notifications, and additional features in the future.

The backend must support these features, protect private user data, process geographic queries, and remain maintainable as the application grows.

This document compares three technology decisions:

1. Backend platform.
2. Database technology.
3. API interaction approach.

Each decision considers the alternatives, their advantages and disadvantages, and their suitability for FishMap's requirements.

## 2. Decision 1: Backend Platform

Three backend platforms were considered: Node.js with TypeScript, Python with FastAPI, and Java with Spring Boot.

### 2.1 Alternatives

| Criterion | Node.js + TypeScript | Python + FastAPI | Java + Spring Boot |
|---|---|---|---|
| Programming language | TypeScript / JavaScript | Python | Java |
| Development speed | High for web APIs | High for APIs and prototypes | Moderate; structured but more configuration may be required |
| Type safety | Static type checking through TypeScript | Type hints and validation; runtime guarantees depend on implementation | Strong static typing |
| Asynchronous operations | Supports asynchronous I/O | Supports asynchronous endpoints | Supports several concurrency models |
| AI integration | Can call external AI APIs | Strong ecosystem for machine learning and data science | Supports AI integrations through libraries and APIs |
| Ecosystem | Large web-development ecosystem | Strong API and data-science ecosystem | Mature enterprise ecosystem |
| Main disadvantage | TypeScript types do not automatically validate all runtime input | Separate typing and validation practices are needed; Python ML libraries do not automatically make the whole backend simpler | Can require more setup and framework knowledge for a small team |

### 2.2 Evaluation

**Node.js with TypeScript** is well suited to applications that rely heavily on web APIs, authentication, real-time interactions, and asynchronous I/O. TypeScript also helps developers maintain clearer contracts between backend modules. Node.js provides a JavaScript runtime, while TypeScript adds static type checking during development.

**Python with FastAPI** is a strong alternative when machine learning, data analysis, or Python-based processing is central to the backend. FastAPI supports API development with Python type annotations and request validation. However, choosing Python solely because FishMap may use AI would not necessarily simplify the rest of the application.

**Java with Spring Boot** provides a mature ecosystem for structured backend systems, dependency injection, security, and data access. It is suitable for larger systems that benefit from established enterprise conventions, but its setup and learning requirements may be greater than necessary for the current project.

### 2.3 Selected technology: Node.js with TypeScript

**Decision:** Use Node.js with TypeScript for the primary backend platform.

This choice is justified by the following FishMap requirements:

- The application needs several HTTP APIs for users, fishing spots, catches, inventory, and social features.
- Asynchronous operations are useful for handling API requests and external integrations.
- TypeScript can improve maintainability as the number of modules and services increases.
- The platform supports integration with external weather and AI APIs without requiring the entire backend to use a separate language.
- The existing backend work is based on Node.js, so continuing with this platform avoids an unnecessary rewrite.

Python can still be introduced as a separate service if a future AI feature requires Python-specific libraries. This should be done only when a concrete requirement justifies the additional service and deployment complexity.

**Conclusion:** Node.js with TypeScript provides the most practical balance of development speed, maintainability, and compatibility with the current FishMap backend.

## 3. Decision 2: Database Technology

Three database alternatives were considered: PostgreSQL with PostGIS, MongoDB, and MySQL.

### 3.1 Alternatives

| Criterion | PostgreSQL + PostGIS | MongoDB | MySQL |
|---|---|---|---|
| Data model | Relational tables with support for structured and geographic data | Document-oriented collections | Relational tables |
| Relationships | Foreign keys, joins, and transactions | Embedded documents or references between documents | Foreign keys, joins, and transactions |
| Geographic queries | PostGIS supports spatial types, indexes, and geographic operations | Supports GeoJSON, geospatial indexes, and proximity queries | Provides spatial data types and spatial functions |
| Data consistency | Strong transactional support | Document-level atomicity and multi-document transactions | Strong transactional support with InnoDB |
| Suitable FishMap data | Users, friendships, catches, spots, inventory, posts, comments | Flexible documents and records with varying structures | Users, inventory, posts, and other relational records |
| Main disadvantage | Requires suitable schema design and database administration | Complex relationships and cross-collection operations may require more deliberate modeling | Does not provide the same PostGIS feature set for advanced spatial analysis |

PostGIS extends PostgreSQL with geographic and geometric data types and spatial operations. MongoDB also supports geospatial queries through GeoJSON and indexes such as `2dsphere`. Therefore, MongoDB is a viable alternative for location-based applications; geographic functionality alone does not make one database universally superior.

References: [PostGIS — OSGeo](https://www.osgeo.org/projects/postgis/), [MongoDB Geospatial Queries](https://www.mongodb.com/docs/manual/geospatial-queries/), [AWS comparison of MongoDB and PostgreSQL](https://aws.amazon.com/compare/the-difference-between-mongodb-and-postgresql/).

### 3.2 Evaluation

**PostgreSQL with PostGIS** is suitable when the application needs relational integrity and advanced geographic queries. FishMap contains related entities: a user owns fishing spots, catches are associated with users and locations, inventory items belong to users, and posts may have comments and visibility rules. Relational constraints and transactions help maintain consistency between these entities.

PostGIS can support queries such as finding fishing spots within a specified radius, ordering locations by distance, and working with geographic boundaries. Spatial indexes can improve query efficiency when properly selected and configured.

**MongoDB** is suitable when flexible document structures are a major priority. It can store location data and execute proximity queries. However, FishMap's numerous relationships and ownership rules mean that document modeling, references, and consistency requirements would need careful consideration.

**MySQL** is another established relational database. It can support many of FishMap's transactional and relational requirements, including spatial operations. PostgreSQL with PostGIS is preferred because it offers a particularly extensive set of geographic data types and spatial functions for the map-centered requirements of the project.

### 3.3 Selected technology: PostgreSQL with PostGIS

**Decision:** Use PostgreSQL with the PostGIS extension as the primary database, subject to confirmation against the final deployment environment.

The decision is justified by the following requirements:

- **Fishing maps:** Efficient geographic queries for nearby fishing spots and distance-based search.
- **Relational data:** Clear relationships between users, spots, catches, inventory items, posts, and comments.
- **Data integrity:** Constraints and transactions to help maintain consistency.
- **Privacy:** Database relationships can support resource ownership and visibility rules, although authorization must also be enforced in backend logic.
- **Future growth:** Geographic queries can be extended as the dataset and feature set grow.

The database schema should use spatial types and appropriate indexes for location fields. Performance should be measured with representative data and query plans rather than assumed in advance.

**Conclusion:** PostgreSQL with PostGIS is the preferred database because it combines relational integrity with advanced spatial functionality needed by FishMap.

## 4. Decision 3: API Interaction Approach

Three API interaction approaches were considered: REST, GraphQL, and gRPC.

### 4.1 Alternatives

| Criterion | REST | GraphQL | gRPC |
|---|---|---|---|
| Communication model | Resources accessed through HTTP methods and endpoints | Clients request selected fields through a typed schema | Clients call defined remote procedures |
| Typical data format | JSON | Usually JSON responses | Protocol Buffers by default |
| Browser and mobile support | Broad native support | Broad support through HTTP clients | Browser use commonly requires gRPC-Web or an appropriate gateway |
| Data selection | Determined by endpoints and response schemas | Clients can request specific fields and related objects | Defined by request and response message schemas |
| Documentation | Can be described with OpenAPI | Uses a GraphQL schema | Uses Protocol Buffers service definitions |
| Main advantage | Simple, familiar, and easy to test | Flexible responses for complex client screens | Strong contracts and efficient service-to-service communication |
| Main disadvantage | Some screens may need multiple requests or purpose-built endpoints | Requires query-cost controls, resolver management, and careful authorization | Adds tooling and integration complexity for a public mobile/web API |

### 4.2 Evaluation

**REST** organizes APIs around resources and HTTP operations. For example, FishMap can expose endpoints for users, fishing spots, catches, inventory, and posts. REST is widely supported by mobile clients, browsers, testing tools, and API gateways. OpenAPI can be used to document endpoints and help generate clients.

**GraphQL** allows clients to request exactly the fields they need and retrieve related data through a single query. This can be useful for social feeds that combine user information, posts, comments, and catch details. However, GraphQL requires careful authorization at the field and object levels, as well as controls for expensive queries and resolver performance.

**gRPC** uses defined service methods and message schemas. It can be effective for internal communication between backend services, especially when strong contracts or streaming are important. For FishMap's public-facing mobile and web clients, it introduces additional integration requirements compared with a conventional REST API.

References: [Postman — Types of APIs](https://blog.postman.com/different-types-of-apis/), [gRPC Documentation](https://grpc.io/docs/).

### 4.3 Selected technology: REST

**Decision:** Use REST over HTTP with JSON for the primary client-facing API.

This decision is justified by FishMap's requirements:

- **Cross-platform access:** Web and mobile clients can use standard HTTP libraries.
- **CRUD operations:** Users, fishing spots, catches, inventory, posts, and comments map naturally to resource-oriented endpoints.
- **Debugging and testing:** REST endpoints are straightforward to test using common HTTP tools.
- **Authentication:** Access tokens can be validated by the backend on protected endpoints.
- **Maintainability:** OpenAPI documentation and automated API tests can help maintain stable contracts.
- **Incremental development:** New features can be added as endpoints without requiring a GraphQL schema or a gRPC client-generation workflow for every consumer.

GraphQL may be reconsidered if FishMap develops complex feed screens that repeatedly require multiple related resources and REST endpoints become difficult to manage. gRPC may be considered for internal service-to-service communication if measurements show that it offers meaningful benefits.

These possibilities do not need to be implemented in the initial version.

**Conclusion:** REST is the most practical default for FishMap's client-facing API because it is broadly compatible, easy to test, and sufficient for the current resource-oriented features.

## 5. Final Technology Decisions

| Decision | Selected option | Main justification |
|---|---|---|
| Backend platform | Node.js + TypeScript | Fits the existing backend, supports asynchronous API development, and improves maintainability through static typing. |
| Database | PostgreSQL + PostGIS | Combines relational data integrity with advanced geographic queries for fishing spots and catch locations. |
| API interaction | REST over HTTP with JSON | Provides straightforward access for web and mobile clients and supports resource-oriented operations. |

## 6. Conclusion

The comparison identified three technologies that best match FishMap's current requirements: Node.js with TypeScript for the backend, PostgreSQL with PostGIS for persistent and geographic data, and REST for communication with web and mobile clients.

These choices prioritize maintainability, geographic search, data consistency, and compatibility with cross-platform clients. They also avoid introducing additional architectural complexity before it is justified by actual project needs.

The alternatives remain valid in different circumstances. Python with FastAPI may be appropriate for a dedicated AI service, MongoDB may suit a document-centered data model, and GraphQL or gRPC may become useful for specific communication requirements. For the current scope, however, the selected combination provides a coherent starting point for further FishMap development.

## 7. References

1. Node.js. *Node.js Documentation*. https://nodejs.org/docs/latest/api/
2. FastAPI. *FastAPI Documentation*. https://fastapi.tiangolo.com/
3. Spring. *Spring Boot Documentation*. https://docs.spring.io/spring-boot/
4. OSGeo. *PostGIS*. https://www.osgeo.org/projects/postgis/
5. MongoDB. *Geospatial Queries*. https://www.mongodb.com/docs/manual/geospatial-queries/
6. Amazon Web Services. *MongoDB vs. PostgreSQL*. https://aws.amazon.com/compare/the-difference-between-mongodb-and-postgresql/
7. Postman. *A Guide to the Different Types of APIs*. https://blog.postman.com/different-types-of-apis/
8. gRPC. *gRPC Documentation*. https://grpc.io/docs/
