# FIS-19: Backend Functional and Non-Functional Requirements

**Author:** Ataniyaz Mutigolla  
**Project:** FishMap — Cross-Platform Intelligent System for Recreational Fishing  
**Task:** FIS-19 — Write Backend Requirements and Non-Functional Requirements  
**Document:** `docs/backend-requirements.md`

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for the FishMap backend. It describes the expected behavior of the API, data storage, authentication, authorization, performance, reliability, and integration with external services.

The requirements will guide backend implementation and provide measurable criteria for testing and verification.

### 1.2 System overview

FishMap is a cross-platform application for recreational anglers. Its backend supports account management, fishing locations, catch records, equipment inventory, social interactions, messaging, weather information, and AI-assisted fishing recommendations.

The backend uses a modular microservice architecture with an API Gateway. The project documentation identifies Node.js, PostgreSQL/PostGIS, and REST APIs as the principal technologies.

### 1.3 Requirement priorities

| Priority | Meaning |
|---|---|
| **Must** | Essential for the core application, security, or data integrity. |
| **Should** | Important for a complete and usable application but can follow core functionality. |
| **Could** | An optional enhancement that can be implemented when time and resources permit. |

### 1.4 Requirement verification

Each requirement has a unique ID, a priority, a user-need reference, and a measurable acceptance criterion. Verification should use automated tests, API integration tests, database checks, security tests, or controlled performance tests, as appropriate.

The performance targets in this document are proposed engineering targets. They must be validated against the final deployment environment.

## 2. User Needs and Traceability

The following user needs are used to trace backend requirements to the project's expected functionality.

| User need ID | User need | Example user action |
|---|---|---|
| UN-01 | Secure account access | Register, sign in, and manage an account. |
| UN-02 | Manage personal information | View and update a profile. |
| UN-03 | Discover and save fishing locations | Find nearby spots and save personal locations. |
| UN-04 | Record fishing activity | Save catches, photos, and trip details. |
| UN-05 | Manage fishing equipment | Add equipment and update its quantity. |
| UN-06 | Connect with other anglers | Find users, send friend requests, and manage friendships. |
| UN-07 | Share fishing experiences | Publish posts, comment, and interact with the community. |
| UN-08 | Communicate privately | Send messages to another user. |
| UN-09 | Plan fishing trips | View weather forecasts and fishing suitability information. |
| UN-10 | Receive fishing assistance | Request AI-based recommendations. |
| UN-11 | Protect personal information | Control access to profiles, equipment, and fishing locations. |
| UN-12 | Use a reliable cross-platform application | Receive consistent responses and preserve data across sessions. |

## 3. Functional Requirements

### 3.1 Authentication and account security

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| FR-AUTH-01 | The backend shall allow a user to register an account with valid required information and credentials. | Must | UN-01 | An integration test submits valid registration data and receives a successful response. A second registration using an existing unique account identifier is rejected. |
| FR-AUTH-02 | The backend shall authenticate users using their registered credentials. | Must | UN-01 | A test using valid credentials succeeds, while a test using an incorrect password fails without issuing valid authentication tokens. |
| FR-AUTH-03 | The backend shall protect passwords using a suitable password-hashing algorithm rather than storing plaintext passwords. | Must | UN-01 | A database inspection confirms that stored password values are hashes and do not equal the submitted plaintext passwords. |
| FR-AUTH-04 | The backend shall validate access tokens for protected API endpoints. | Must | UN-01, UN-11 | Requests with a valid token are authorized when permitted; requests with missing, invalid, or expired tokens are rejected. |
| FR-AUTH-05 | The backend shall support secure refresh-token renewal and invalidation. | Must | UN-01, UN-11 | Tests confirm that valid refresh tokens can be renewed, invalidated tokens are rejected, and previously rotated tokens cannot be reused successfully. |
| FR-AUTH-06 | The backend should support password recovery and email verification where these features are enabled. | Should | UN-01 | Integration tests confirm that valid verification or recovery tokens complete the intended operation and invalid or expired tokens are rejected. |

### 3.2 User profiles

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| FR-USER-01 | The backend shall allow authenticated users to retrieve and update their own profiles. | Must | UN-02 | An authorized user can update permitted profile fields and retrieve the saved values after the update. |
| FR-USER-02 | The backend shall prevent users from modifying another user's protected profile information without authorization. | Must | UN-02, UN-11 | An integration test attempts to update another user's protected fields and confirms that the operation is denied. |
| FR-USER-03 | The backend should support profile visibility settings where applicable. | Should | UN-02, UN-11 | Tests using accounts with different visibility settings confirm that unauthorized requests do not expose restricted profile fields. |

### 3.3 Fishing locations and map data

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| FR-MAP-01 | The backend shall allow authorized users to create fishing spots with valid location coordinates and required spot information. | Must | UN-03 | A test creates a spot with valid coordinates and retrieves the saved location and associated fields. Invalid coordinates are rejected. |
| FR-MAP-02 | The backend shall support retrieving fishing spots within a specified geographic area. | Must | UN-03 | Given test spots inside and outside a defined search area, the response contains only spots satisfying the specified spatial filter. |
| FR-MAP-03 | The backend should support radius-based search for nearby fishing spots. | Should | UN-03, UN-09 | A test with known coordinates and a specified radius returns matching spots within the defined distance and excludes spots outside it, subject to the documented boundary rule. |
| FR-MAP-04 | The backend shall enforce ownership and visibility rules for private fishing spots. | Must | UN-03, UN-11 | Tests confirm that the owner can access a private spot and unauthorized users cannot retrieve its restricted details through direct API requests. |
| FR-MAP-05 | The backend shall validate changes to fishing-spot information and enforce the applicable update permissions. | Must | UN-03, UN-11 | An authorized owner can update permitted fields; unauthorized modifications and invalid location values are rejected. |

### 3.4 Catches and fishing records

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| FR-CATCH-01 | The backend shall allow users to create catch records containing the supported catch information. | Must | UN-04 | An authenticated user creates a valid catch record and retrieves it with the saved values. |
| FR-CATCH-02 | The backend shall associate each catch record with its authorized owner. | Must | UN-04, UN-11 | A database and API integration test confirms that a catch is associated with the authenticated user and cannot be reassigned by an unauthorized request. |
| FR-CATCH-03 | The backend should support updating and deleting catch records according to ownership rules. | Should | UN-04 | Tests confirm that an owner can perform permitted updates or deletions and another user cannot modify the record. |
| FR-CATCH-04 | The backend should support optional catch photographs and additional catch details. | Should | UN-04 | A valid catch with an accepted photo reference and supported details can be saved and retrieved; invalid media references are rejected. |
| FR-CATCH-05 | The backend should provide personal fishing statistics based on stored catch records. | Should | UN-04, UN-09 | Given a predefined test dataset, returned totals and supported statistics match independently calculated expected values. |

### 3.5 Equipment inventory

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| FR-INV-01 | The backend shall allow users to create, retrieve, update, and delete their inventory items. | Must | UN-05 | Integration tests verify each supported operation and confirm that the updated state persists in the database. |
| FR-INV-02 | The backend shall validate inventory quantities and other required fields. | Must | UN-05 | Invalid quantities and missing required fields are rejected with an appropriate client-error response. |
| FR-INV-03 | The backend shall enforce inventory ownership and visibility settings. | Must | UN-05, UN-11 | Tests confirm that owners can manage their own inventory and other users can access only the information permitted by the configured visibility rules. |

### 3.6 Social features

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| FR-SOC-01 | The backend shall support sending, accepting, and managing friend requests. | Should | UN-06 | Integration tests verify valid friendship transitions and reject invalid or unauthorized transitions. |
| FR-SOC-02 | The backend should support finding users through supported search criteria. | Should | UN-06 | A test dataset produces matching users for a valid query without exposing fields that the requester is not allowed to see. |
| FR-SOC-03 | The backend shall support creating, retrieving, updating where permitted, and deleting social posts. | Should | UN-07 | Tests verify post creation and retrieval and confirm that modification and deletion follow the applicable ownership rules. |
| FR-SOC-04 | The backend shall enforce visibility and authorization rules for posts and comments. | Must | UN-07, UN-11 | Requests from users without permission cannot retrieve restricted posts or perform unauthorized comment operations. |
| FR-SOC-05 | The backend should support comments on posts. | Should | UN-07 | An authorized user can create and retrieve a comment associated with the correct post; invalid post references are rejected. |
| FR-SOC-06 | The backend should support notifications for relevant social events. | Should | UN-06, UN-07 | A test of a configured event, such as an accepted friend request, confirms that the expected notification is created for the intended recipient. |

### 3.7 Messaging, weather, and AI

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| FR-CHAT-01 | The backend should support private one-to-one messaging between authorized participants. | Should | UN-08 | A participant can send and retrieve messages in an authorized conversation; a non-participant cannot access the conversation. |
| FR-CHAT-02 | The backend should preserve the association between messages and their conversation participants. | Should | UN-08, UN-11 | Integration tests verify that each stored message belongs to the correct conversation and is returned only to authorized participants. |
| FR-WEATHER-01 | The backend should retrieve weather information from a configured external provider for a requested location. | Should | UN-09 | With a mocked provider response, a valid request returns the expected weather fields, while provider failures produce a controlled error response. |
| FR-WEATHER-02 | The backend should provide a fishing-suitability indicator when supported by available weather data. | Could | UN-09 | Given a predefined weather dataset, the calculation returns a value within the documented scale and follows the documented calculation rules. |
| FR-AI-01 | The backend should provide fishing or equipment recommendations through a configured AI or recommendation service. | Should | UN-10 | A test with a controlled recommendation response returns a result in the documented response format; a failed provider request is handled without an unhandled server error. |
| FR-AI-02 | The backend should validate inputs and constrain the output format of AI-assisted features. | Should | UN-10, UN-11 | Invalid requests are rejected, and the service response conforms to the documented schema or returns a controlled error. |

### 3.8 API Gateway and error handling

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| FR-API-01 | The API Gateway shall route supported requests to the appropriate backend service. | Must | UN-12 | Integration tests call representative routes and verify that each request reaches the expected service. |
| FR-API-02 | The backend shall return consistent, documented response formats and appropriate HTTP status codes. | Must | UN-12 | API tests verify response schemas and status codes for successful requests, validation errors, authentication failures, missing resources, and internal failures. |
| FR-API-03 | The backend shall validate client input before processing operations that depend on it. | Must | UN-12, UN-11 | Requests containing invalid identifiers, malformed values, or missing required fields are rejected without unintended database changes. |
| FR-API-04 | The backend shall handle unavailable downstream services without exposing internal implementation details to clients. | Must | UN-12 | With a downstream service deliberately unavailable, the gateway returns a controlled error response and does not expose stack traces or secrets. |
| FR-API-05 | The backend should document public API endpoints, request schemas, response schemas, and authentication requirements. | Should | UN-12 | A reviewer can use the API specification to identify each documented endpoint, its required inputs, expected responses, and security requirements. |

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| NFR-PERF-01 | The backend shall provide acceptable response times for common API operations. | Must | UN-03, UN-04, UN-12 | Under a documented baseline test with 50 concurrent virtual users and a representative dataset, at least 95% of ordinary database-backed API requests complete within 500 ms, excluding external-provider latency. |
| NFR-PERF-02 | Geographic search shall meet the project's response-time target. | Must | UN-03, UN-09 | Under the same documented baseline conditions, at least 95% of radius and area search requests complete within 1 second. Test data size, index configuration, and query parameters are recorded. |
| NFR-PERF-03 | The backend shall support concurrent client requests without losing data or returning incorrect results. | Must | UN-12 | A load test with 50 concurrent virtual users completes the defined workload without duplicate records caused by the tested operations, data corruption, or unhandled server exceptions. |
| NFR-PERF-04 | The backend should control the cost of external API calls through suitable caching or request management. | Should | UN-09, UN-10 | Repeated equivalent weather requests within the configured cache lifetime use the cached result when applicable, and tests verify the documented cache-expiration behavior. |

*The 50-user workload and response-time targets are initial acceptance targets, not measured results. They may be revised after baseline testing and supervisor review.*

### 4.2 Security and privacy

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| NFR-SEC-01 | All protected operations shall enforce authentication and authorization on the server. | Must | UN-01, UN-11 | Automated security tests verify that missing credentials and unauthorized resource access are rejected across all protected endpoint groups. |
| NFR-SEC-02 | Passwords and authentication secrets shall not be stored or logged in plaintext. | Must | UN-01, UN-11 | Database inspection and log tests confirm that plaintext passwords, access tokens, refresh tokens, and configured secret values are not exposed in persistent records or application logs. |
| NFR-SEC-03 | The backend shall validate and safely handle untrusted client input. | Must | UN-11, UN-12 | Tests with malformed input and common injection payloads confirm that requests are handled safely and do not execute unintended database operations. |
| NFR-SEC-04 | Private fishing spots, profile information, inventory, messages, and restricted posts shall not be disclosed to unauthorized users. | Must | UN-11 | A role-and-ownership test matrix confirms that unauthorized requests cannot retrieve restricted data through direct endpoints or related API responses. |
| NFR-SEC-05 | The backend shall avoid exposing stack traces, credentials, internal service addresses, and other sensitive implementation details in public error responses. | Must | UN-11, UN-12 | Tests trigger representative server errors and verify that responses contain a controlled error structure without sensitive internal details. |
| NFR-SEC-06 | The deployment shall use encrypted transport for production client connections. | Must | UN-01, UN-11 | A deployment check confirms that public API traffic uses HTTPS and that insecure HTTP requests are redirected or rejected according to the deployment policy. |
| NFR-SEC-07 | Uploaded media shall be validated, and location metadata shall be handled according to the application's privacy policy. | Should | UN-04, UN-11 | Tests reject unsupported media types and verify the configured metadata-handling behavior for uploaded photographs before public distribution. |
| NFR-SEC-08 | The backend should apply rate limits or equivalent controls to sensitive endpoints. | Should | UN-01, UN-11 | Automated tests exceed the configured request threshold and verify that the service returns the documented rate-limit response. |

### 4.3 Reliability and data integrity

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| NFR-REL-01 | The backend shall preserve data consistency during supported create, update, and delete operations. | Must | UN-03, UN-04, UN-05 | Integration tests verify database constraints and transactional behavior for representative operations, including invalid references and failed transactions. |
| NFR-REL-02 | The backend shall expose health information for operational monitoring. | Must | UN-12 | Each configured service responds to its health check, and the response identifies whether the service is operational according to its documented checks. |
| NFR-REL-03 | The backend shall handle external-provider failures without crashing unrelated application functions. | Must | UN-09, UN-10, UN-12 | Tests simulate weather and AI provider failures and confirm controlled error responses while unrelated health checks continue to pass. |
| NFR-REL-04 | Database backup and recovery procedures shall be documented and tested. | Should | UN-04, UN-05, UN-12 | A recovery exercise restores a database backup into a test environment and verifies that predefined records can be retrieved. |
| NFR-REL-05 | The backend shall avoid duplicate processing for operations where retries could create unintended duplicate records. | Should | UN-04, UN-07, UN-08 | Tests repeat the same supported retry or idempotency scenario and confirm the documented behavior, including duplicate prevention where required. |

### 4.4 Maintainability and testability

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| NFR-MAINT-01 | Backend services shall have documented responsibilities and API contracts. | Must | UN-12 | Each service has a documented purpose, exposed routes, request and response expectations, and relevant authorization requirements. |
| NFR-MAINT-02 | The backend shall have automated tests for critical application functionality. | Must | UN-01, UN-03, UN-04, UN-05, UN-11 | The automated test suite includes passing tests for authentication, ownership and privacy checks, spatial queries, and core data operations. |
| NFR-MAINT-03 | Configuration and secrets shall be separated from committed application source code. | Must | UN-01, UN-11, UN-12 | Repository checks confirm that required credentials are provided through environment configuration or an approved secret-management mechanism and that real secrets are not committed. |
| NFR-MAINT-04 | Database schema changes shall be repeatable and documented. | Must | UN-03, UN-04, UN-05, UN-12 | A clean test database can be initialized using the documented migration process, and the resulting schema matches the expected version. |
| NFR-MAINT-05 | The backend should provide structured logs suitable for debugging and monitoring. | Should | UN-12 | A test request produces a log entry with the documented fields, such as timestamp, service, and request correlation identifier, without logging sensitive data. |

### 4.5 Scalability and compatibility

| ID | Requirement | Priority | Traceability | Verifiable acceptance criterion |
|---|---|---|---|---|
| NFR-SCALE-01 | The backend should support scaling individual services without requiring all other services to be redeployed. | Should | UN-12 | In a controlled deployment test, one service instance can be restarted or scaled according to the deployment configuration while other services remain available, subject to their dependencies. |
| NFR-SCALE-02 | The backend shall use stable and documented API contracts for supported clients. | Must | UN-12 | Contract tests confirm that documented request and response schemas remain compatible for the supported client version; intentional breaking changes require explicit documentation and updated tests. |
| NFR-SCALE-03 | The backend shall paginate collection endpoints that can return large result sets. | Should | UN-03, UN-06, UN-07, UN-12 | Tests request multiple pages and verify that results respect the configured page-size limit and do not repeat records within a stable test dataset. |

## 5. Requirements Traceability Matrix

This matrix summarizes how the requirements address the identified user needs.

| User need | Related functional requirements | Related non-functional requirements |
|---|---|---|
| UN-01: Secure account access | FR-AUTH-01 to FR-AUTH-06 | NFR-SEC-01, NFR-SEC-02, NFR-SEC-06, NFR-SEC-08 |
| UN-02: Manage personal information | FR-USER-01 to FR-USER-03 | NFR-SEC-01, NFR-SEC-04 |
| UN-03: Discover fishing locations | FR-MAP-01 to FR-MAP-05 | NFR-PERF-01, NFR-PERF-02, NFR-REL-01, NFR-SCALE-03 |
| UN-04: Record fishing activity | FR-CATCH-01 to FR-CATCH-05 | NFR-PERF-01, NFR-SEC-07, NFR-REL-01, NFR-REL-04, NFR-REL-05 |
| UN-05: Manage equipment | FR-INV-01 to FR-INV-03 | NFR-REL-01, NFR-MAINT-02, NFR-MAINT-04 |
| UN-06: Connect with anglers | FR-SOC-01, FR-SOC-02, FR-SOC-06 | NFR-PERF-03, NFR-SEC-04, NFR-SCALE-03 |
| UN-07: Share experiences | FR-SOC-03 to FR-SOC-06 | NFR-SEC-04, NFR-REL-05, NFR-SCALE-03 |
| UN-08: Private messaging | FR-CHAT-01, FR-CHAT-02 | NFR-SEC-01, NFR-SEC-04, NFR-REL-01 |
| UN-09: Plan fishing trips | FR-MAP-03, FR-CATCH-05, FR-WEATHER-01, FR-WEATHER-02 | NFR-PERF-02, NFR-PERF-04, NFR-REL-03 |
| UN-10: AI assistance | FR-AI-01, FR-AI-02 | NFR-PERF-04, NFR-REL-03 |
| UN-11: Protect personal information | FR-AUTH-04, FR-AUTH-05, FR-USER-02, FR-USER-03, FR-MAP-04, FR-MAP-05, FR-INV-03, FR-SOC-04, FR-CHAT-02 | NFR-SEC-01 to NFR-SEC-08 |
| UN-12: Reliable cross-platform application | FR-API-01 to FR-API-05 | NFR-PERF-01, NFR-PERF-03, NFR-REL-01 to NFR-REL-05, NFR-MAINT-01 to NFR-MAINT-05, NFR-SCALE-01 to NFR-SCALE-03 |

## 6. Verification Plan

The requirements shall be verified using the following methods.

| Verification method | Purpose | Example requirements |
|---|---|---|
| Unit testing | Verify individual functions and validation rules. | FR-AUTH-03, FR-WEATHER-02, FR-API-03 |
| API integration testing | Verify requests across the gateway, services, and database. | FR-AUTH-01, FR-MAP-01, FR-CATCH-01, FR-INV-01 |
| Authorization testing | Verify ownership, visibility, and access control. | FR-MAP-04, FR-USER-02, FR-INV-03, FR-SOC-04, NFR-SEC-04 |
| Database testing | Verify persistence, constraints, migrations, and transactions. | NFR-REL-01, NFR-REL-04, NFR-MAINT-04 |
| Performance testing | Measure response time and behavior under concurrent requests. | NFR-PERF-01, NFR-PERF-02, NFR-PERF-03 |
| Failure testing | Simulate unavailable downstream services and invalid provider responses. | FR-API-04, NFR-REL-03 |
| Deployment and configuration checks | Verify HTTPS, health checks, and secret handling. | NFR-SEC-02, NFR-SEC-06, NFR-REL-02, NFR-MAINT-03 |

### 6.1 Acceptance process

A requirement is considered verified only when its stated acceptance criterion has been tested and the result has been recorded.

For each verification run, the project team should record:

- Requirement ID.
- Test case or test script.
- Test environment and relevant configuration.
- Expected result.
- Actual result.
- Pass/fail status.
- Defects or follow-up actions.

Requirements that depend on optional features or external integrations should be marked as not applicable only when the feature has explicitly been excluded from the approved project scope. Untested requirements must not be reported as passed.

## 7. Assumptions and Constraints

1. The requirements describe the intended backend behavior and are not evidence that every feature has already been implemented.
2. The current architecture documentation identifies Node.js services, a PostgreSQL/PostGIS database environment, and an API Gateway. Implementation details must be verified against the repository.
3. Weather and AI functionality depend on external providers or configured fallback mechanisms; their availability cannot be guaranteed by FishMap alone.
4. Privacy and authorization requirements apply to API responses and backend operations, not only to client-side interface controls.
5. Performance targets are provisional and should be reviewed after representative load tests.
6. Production availability, legal compliance, data-retention periods, and exact backup schedules require additional deployment and stakeholder decisions.

## 8. Conclusion

This document defines the expected backend behavior for FishMap and establishes measurable acceptance criteria for functional and non-functional requirements. The functional requirements cover authentication, profiles, fishing locations, catches, inventory, social features, messaging, weather, AI assistance, and API behavior. The non-functional requirements cover performance, security, privacy, reliability, maintainability, scalability, and compatibility.

Each requirement is linked to a user need and has a unique identifier and priority. This structure allows the project team to connect user expectations to implementation tasks and test results.

The next step is to map these requirements to the existing backend endpoints and automated tests, identify any missing functionality, and record verification results before claiming that a requirement has been satisfied.
