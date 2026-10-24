# Backend Verification Plan

## 1. Purpose and Scope

### 1.1 Purpose

This document defines a verification plan for the FishMap backend. It describes the testing strategy, test types, performance metrics, measurement conditions, and baseline used to evaluate backend reliability, correctness, security, and performance.

The plan covers the backend services, API Gateway, database interactions, and integrations with external services.

### 1.2 Scope

The verification scope includes:

- API Gateway and routing.
- Authentication and authorization.
- User profiles and account management.
- Fishing spots, sessions, catches, and fishing analytics.
- Lure inventory management and visibility rules.
- Social features, including posts, comments, friendships, and notifications.
- One-to-one chat.
- Weather information and caching.
- AI-powered recommendations and fallback behavior.
- Database persistence, migrations, and data integrity.
- Service health and inter-service communication.
- Performance, stability, and security checks.

The Flutter frontend is outside the scope of this document except where it is necessary to verify backend API behavior.

### 1.3 Verification Objectives

The verification process aims to:

1. Confirm that backend endpoints return the expected responses.
2. Verify authentication, authorization, and data visibility rules.
3. Confirm that data is stored, retrieved, updated, and deleted correctly.
4. Verify error handling and validation of invalid requests.
5. Check database migrations and persistence.
6. Evaluate backend response time and throughput under a defined workload.
7. Verify service availability and recovery from dependency failures where practical.
8. Identify security weaknesses and configuration problems.
9. Compare the candidate version against a reproducible baseline.

### 1.4 Out of Scope

The following are excluded unless explicitly added to the test scope:

- Flutter UI and visual design testing.
- App Store and TestFlight distribution.
- Production-scale traffic testing.
- Formal penetration testing by an external security team.
- Accuracy certification of external weather data.
- Guaranteed accuracy of AI-generated fishing recommendations.

---

## 2. Verification Strategy

Verification combines automated tests, API checks, database checks, integration tests, end-to-end tests, security checks, and performance measurements.

The test results must distinguish between tests that have passed, failed, been skipped, or have not yet been executed.

### 2.1 Unit Testing

**Objective:** Verify individual functions and modules independently of external services.

**Areas to test:**

- Input validation and data normalization.
- Authentication and token-related functions.
- Authorization and visibility rules.
- Fishing calculations and analytics.
- Inventory quantity updates.
- Social relationship and notification logic.
- Weather suitability calculations.
- AI recommendation fallback rules.
- Error handling and response formatting.

**Metrics:**

- Number of tests executed.
- Number and percentage of tests passed.
- Number of failed and skipped tests.
- Code coverage, where supported by the configured test tooling.

**Conditions:**

- Use deterministic test inputs.
- Mock external services when appropriate.
- Avoid dependence on production accounts or data.
- Record the test command and exit code.

**Execution:**

The root `package.json` defines `npm test`, which runs the test scripts for the eight backend services and the API Gateway. Run it from the repository root after confirming the required dependencies and test environment are available.

### 2.2 Integration Testing

**Objective:** Verify that backend components work correctly together.

**Areas to test:**

- API Gateway routing to backend services.
- Authentication and authorization across services.
- Database queries and persistence.
- Service-to-service requests.
- Refresh-token rotation and invalidation.
- Friendship and content visibility rules.
- Chat message persistence.
- Weather-provider integration and caching.
- AI provider integration and fallback behavior.

**Metrics:**

- Integration tests passed and failed.
- HTTP status codes.
- Response latency.
- Database operation success rate.
- Unexpected exceptions and connection failures.

**Conditions:**

- Start the required dependencies before executing tests.
- Use an isolated test database.
- Apply the required migrations.
- Use mocks for external dependencies when testing deterministic fallback behavior.
- Record external-service availability when real integrations are tested.

### 2.3 API and Contract Testing

**Objective:** Verify that API endpoints follow their expected request and response contracts.

**Checks:**

- Correct HTTP methods and routes.
- Required fields and data types.
- Successful response status codes.
- Validation errors for invalid input.
- Authentication requirements.
- Authorization failures.
- Consistent error response formats.
- Pagination and filtering, where implemented.
- Handling of missing resources.
- Protection against unauthorized data access.

**Metrics:**

- Number of endpoints tested.
- Successful and failed assertions.
- HTTP status-code distribution.
- Response latency.
- Contract violations.

**Execution:**

1. Inspect the root and gateway `package.json` files to identify available API test scripts.
2. Run the verified gateway test command, if needed:

   ```bash
   npm run test:gateway
   ```

3. Run the health check with the required services available:

   ```bash
   npm run health:check
   ```

4. Record the command, exit code, HTTP status codes, and response latency.

The `test:gateway` and `health:check` scripts are defined in the root `package.json`. A passing health check does not replace API contract testing.

### 2.4 End-to-End Testing

**Objective:** Verify important user workflows across multiple backend components.

The repository provides `scripts/verify-e2e-runtime.js`, which starts the eight backend services and API Gateway on ports 4000–4008, checks their `/health` endpoints, and executes 13 end-to-end user journeys through the API Gateway.

**Candidate workflows include:**

1. Register users and authenticate.
2. Access and update a user profile.
3. Create and retrieve a fishing spot.
4. Create a fishing session and record a catch.
5. Add an item to the lure inventory and update its quantity.
6. Verify inventory visibility for different users.
7. Create a post and comment.
8. Establish a friendship and verify access to friends-only content.
9. Send and retrieve a chat message.
10. Retrieve weather information and verify the response structure.
11. Request an AI recommendation and verify fallback behavior when the external provider is unavailable.

The list above summarizes representative workflows. The script's actual 13 journeys may include additional steps or separate flows.

**Prerequisites:**

- Required environment variables must be configured.
- PostgreSQL must be running and accessible.
- Required database migrations must be complete.
- Ports 4000–4008 must be available.
- The test environment must not contain production data.

**Execution:**

Run the script from the repository root:

```bash
node scripts/verify-e2e-runtime.js
```

The script starts its own application servers. Do not start the same services separately before running it, because occupied ports can prevent startup.

**Metrics:**

- Service startup success.
- Health-check results for all nine applications.
- End-to-end journeys passed and failed.
- Failed assertions and unexpected HTTP status codes.
- Database and external-dependency errors.

Record actual results after execution. The presence of 13 journeys in the script does not mean that all journeys have passed.

### 2.5 Database Verification

**Objective:** Verify persistence, relationships, constraints, and migration behavior.

**Checks:**

- Successful database connection.
- Successful migration execution.
- Correct creation and retrieval of records.
- Correct update and deletion behavior.
- Referential integrity.
- Unique constraints and required fields.
- Correct behavior for invalid database operations.
- Persistence after service restart.
- Spatial queries where PostGIS functionality is used.

**Metrics:**

- Migration success or failure.
- Database operation success rate.
- Query latency.
- Constraint violations.
- Connection errors.
- Data consistency failures.

**Conditions:**

- Use a dedicated test database.
- Apply migrations using the repository's verified migration procedure.
- Never run destructive tests against production data.
- Record the database version and relevant configuration.

**Execution:**

The root `package.json` defines the following database migration command:

```bash
npm run db:migrate:all
```

Run it after the database is available and the required environment variables are configured.

### 2.6 Security Testing

**Objective:** Check common authentication, authorization, validation, and dependency risks.

**Checks:**

- Passwords are not stored in plaintext.
- Protected endpoints reject unauthenticated requests.
- Users cannot access resources without the required permissions.
- Expired or invalid tokens are rejected.
- Refresh-token rotation behaves as intended.
- Reuse of invalidated refresh tokens is handled correctly.
- Invalid input is rejected safely.
- Sensitive values are not exposed in API responses or logs.
- Secrets are not committed to source control.
- Dependencies are checked for known vulnerabilities.

**Metrics:**

- Security checks passed and failed.
- Unauthorized requests accepted.
- Sensitive data exposure incidents.
- Dependency audit findings by severity.
- Unexpected authentication or authorization behavior.

**Conditions:**

- Use test accounts with different permission levels.
- Do not use real passwords, tokens, or personal data.
- Run security checks only against the local or designated test environment.
- Treat automated dependency audit results separately from a full penetration test.

**Execution:**

If the root project is configured for npm auditing, run:

```bash
npm audit
```

Record the exit code and findings. Review the actual output rather than assuming that the audit passes.

### 2.7 Performance Testing

**Objective:** Measure response latency, throughput, error rate, and stability under a controlled workload.

The performance tests are based on the requirements in `docs/backend-requirements.md`:

- NFR-PERF-01: ordinary database-backed API requests.
- NFR-PERF-02: geographic radius and area searches.
- NFR-PERF-03: concurrent requests without data corruption, duplicate records caused by tested operations, or unhandled server exceptions.

**Metrics:**

- p50, p95, and p99 response latency.
- Throughput in requests per second.
- HTTP error rate.
- Connection failures and timeouts.
- Resource consumption, where measurable.
- Data-integrity failures under concurrent load.

**Conditions:**

- Use the same workload for baseline and candidate versions.
- Keep hardware and service configuration equivalent.
- Use the same test dataset.
- Ensure the database and required services are healthy.
- Separate warm-up from the measurement period.
- Record all deviations from the planned workload.

---

## 3. Test Environment

### 3.1 Environment Requirements

Tests should be performed in a local or dedicated test environment.

The environment should include:

- The FishMap backend repository at the selected commit.
- A supported Node.js runtime.
- Required npm dependencies.
- PostgreSQL with the PostGIS extension if required by the repository.
- Required environment variables.
- Access to any external services needed by the test.
- A dedicated test database.
- A load-testing tool if performance testing is performed.

The actual Node.js version, database image, and dependency versions must be recorded from the repository configuration and runtime. They must not be assumed.

### 3.2 Service Configuration

The backend startup script defines the following service ports:

| Component         | Port |
| ----------------- | ---: |
| API Gateway       | 4000 |
| Auth Service      | 4001 |
| Users Service     | 4002 |
| Fishing Service   | 4003 |
| Inventory Service | 4004 |
| Social Service    | 4005 |
| Chat Service      | 4006 |
| Weather Service   | 4007 |
| AI Service        | 4008 |

Confirm the actual ports and service list against the current repository configuration before executing the plan.

### 3.3 Database Configuration

The backend uses PostgreSQL and may use PostGIS for spatial operations.

Before testing, record:

- Database engine and version.
- Container image and tag, if Docker is used.
- Host and container ports.
- Database names.
- Migration status.
- Relevant extension versions.
- Whether the database is a clean test instance or contains existing test data.

Do not copy production credentials into test configuration.

### 3.4 Environment Variables and Secrets

Inspect the environment examples and service configuration to determine the required variables.

Before running tests:

1. Confirm that required variables are present.
2. Use local test credentials and test-only secrets.
3. Do not print secret values in the test report.
4. Confirm that missing optional integrations are handled as documented.
5. Record which external services were available during the run.

### 3.5 Environment Record

For every verification run, record:

| Field                 | Value          |
| --------------------- | -------------- |
| Date and time         | To be recorded |
| Git commit            | To be recorded |
| Node.js version       | To be recorded |
| npm version           | To be recorded |
| Database version      | To be recorded |
| Operating system      | To be recorded |
| Test command          | To be recorded |
| Test dataset          | To be recorded |
| External dependencies | To be recorded |
| Result                | To be recorded |

---

## 4. Performance Measurement Plan

### 4.1 Performance Metrics

The following metrics will be collected where the selected test tooling supports them.

**Latency**

- p50: median response time.
- p95: response time below which 95% of measured requests complete.
- p99: response time below which 99% of measured requests complete.

**Throughput**

- Requests per second.
- Number of successful requests during the measurement period.

**Reliability**

- HTTP error rate.
- Connection failures.
- Timeouts.
- Unexpected server errors.

**Resource usage**

- CPU utilization.
- Memory consumption.
- Database connection usage, if measurable.

### 4.2 Test Endpoints

Select representative endpoints from the implemented API.

The endpoint list should include, where available:

- A health endpoint.
- An authentication endpoint.
- A user-profile endpoint.
- A fishing spot or fishing-session endpoint.
- An inventory endpoint.
- A social endpoint.
- A weather endpoint.
- An AI recommendation endpoint.
- A geospatial query endpoint.

The final list must be based on actual routes in the repository. Do not assume that an endpoint exists merely because its feature is included in the plan.

### 4.3 Workload Selection

Select a representative request distribution. Record the endpoints, HTTP methods, payload sizes, authentication requirements, and request frequency.

Use valid test data and avoid uncontrolled calls to external services that could make runs inconsistent.

### 4.4 Load Profile Specification

The following is the proposed standard workload for comparative performance testing:

- **Concurrency:** 50 virtual users.
- **Warm-up:** 30 seconds before collecting measurement results.
- **Measurement duration:** 120 seconds per run.
- **Repetitions:** 3 runs under equivalent conditions.
- **Reported results:** p50, p95, and p99 latency, throughput, HTTP error rate, and resource consumption where measurable.

Use the same endpoint, request distribution, test dataset, hardware, service configuration, and external-dependency conditions for baseline and candidate runs.

The warm-up period must be implemented separately or configured through a supported feature of the selected load-testing tool. Do not use unsupported command-line parameters.

This workload is a proposed measurement protocol. It does not indicate that a benchmark has already been executed.

### 4.5 Baseline and Candidate Comparison

The baseline is the repository state at commit:

`f0560f9651e54346d66b147a7b784ab5580ac324`

This commit represents the documented starting point for the FIS-21 verification work.

The candidate is the commit containing the backend changes being evaluated.

For a fair comparison:

1. Use equivalent hardware and runtime configuration.
2. Use the same database schema and equivalent test data.
3. Use the same endpoints and request distribution.
4. Apply the same warm-up and measurement durations.
5. Perform three measurement runs for each version.
6. Record all results, including failed runs.
7. Investigate substantial differences before drawing conclusions.

If the baseline cannot be started or tested, record the limitation. Do not invent baseline measurements or claim that a comparison was completed.

### 4.6 Performance Results Table

Complete this table after executing the tests.

| Version   | Endpoint | p50 | p95 | p99 | Requests/sec | Error rate |
| --------- | -------- | --: | --: | --: | -----------: | ---------: |
| Baseline  | TBD      | TBD | TBD | TBD |          TBD |        TBD |
| Candidate | TBD      | TBD | TBD | TBD |          TBD |        TBD |

Record each run separately before calculating summary statistics.

---

## 5. Test Execution Procedure

### 5.1 Preparation

1. Confirm the correct repository and Git commit.
2. Confirm the required Node.js version.
3. Install dependencies using the repository's documented procedure if necessary.
4. Configure the test environment.
5. Start the database and required infrastructure.
6. Apply database migrations.
7. Confirm that required services can start.
8. Ensure the test environment contains no production data.

### 5.2 Infrastructure and Database

The root `package.json` defines the following infrastructure commands:

```bash
npm run infra:up
npm run infra:status
```

These scripts start and inspect the PostgreSQL container managed by Docker Compose.

After confirming that PostgreSQL is healthy and required environment variables are configured, run:

```bash
npm run db:migrate:all
```

Record the output and exit code of each command.

### 5.3 Start the Backend

The root `package.json` defines the `dev:all:nowatch` script.

Start the backend from the repository root in a dedicated terminal:

```bash
npm run dev:all:nowatch
```

Wait for the required services to start and remain available. Keep this terminal running while performing tests that require the development backend.

Do not run this startup command before executing the E2E runtime audit if that audit needs the same ports, because the E2E script starts its own application servers.

### 5.4 Automated Tests

The root `package.json` defines `npm test`, which runs the test scripts for all eight backend services and the API Gateway.

Execute:

```bash
npm test
```

Record:

- The exact command.
- The exit code.
- The number of tests passed and failed.
- Skipped tests.
- Error output.
- Any required environment variables or services.

The root project also defines individual test scripts, including `test:auth`, `test:users`, `test:fishing`, `test:inventory`, `test:social`, `test:chat`, `test:weather`, `test:ai`, and `test:gateway`.

Do not report a test suite as passed if it was not executed.

### 5.5 Runtime and Health Verification

The root `package.json` defines:

```bash
npm run health:check
```

Run the command with the required backend services running. Record each service's status, response time, and any reported errors.

A successful health check confirms only the behavior covered by that script; it does not replace functional, integration, or security tests.

### 5.6 End-to-End Verification

The repository provides `scripts/verify-e2e-runtime.js`, which starts the eight backend services and API Gateway on ports 4000–4008, checks their `/health` endpoints, and executes 13 end-to-end user journeys through the API Gateway.

**Prerequisites:**

- Required environment variables must be configured.
- PostgreSQL must be running and accessible.
- Required database migrations must be complete.
- Ports 4000–4008 must be available.
- The test environment must not contain production data.

**Execution:**

Run the script from the repository root:

```bash
node scripts/verify-e2e-runtime.js
```

The script starts its own application servers. Do not start the same services separately before running it, because occupied ports can prevent startup.

**Metrics:**

- Service startup success.
- Health-check results for all nine applications.
- End-to-end journeys passed and failed.
- Failed assertions and unexpected HTTP status codes.
- Database and external-dependency errors.

Record actual results after execution. The presence of 13 journeys in the script does not mean that all journeys have passed.

### 5.7 Security Verification

Run dependency and security checks supported by the repository.

For example, if npm auditing is appropriate for the installed dependencies:

```bash
npm audit
```

Record the exit code and reported findings. Review findings by severity and distinguish development dependencies from production dependencies where the tool provides that information.

A successful dependency audit does not prove that the application is free from security vulnerabilities.

### 5.8 Performance Verification

1. Confirm that the baseline and candidate versions can start.
2. Confirm that the selected endpoints and test data are available.
3. Run the 30-second warm-up.
4. Collect measurements for 120 seconds.
5. Repeat the measurement three times.
6. Record latency percentiles, throughput, errors, and resource consumption.
7. Repeat the same procedure for the other version.
8. Compare the results and explain any deviations.

If the selected tool cannot implement the workload exactly, document the actual configuration used. Do not claim compliance with the proposed profile when the run differs from it.

### 5.9 Cleanup

After testing:

- Stop processes started specifically for the test.
- Remove temporary test data when appropriate.
- Preserve logs and measurement results.
- Do not delete shared or production data.
- Record unresolved failures and environment problems.

---

## 6. Acceptance Criteria

### 6.1 Functional Acceptance Criteria

Functional verification is successful when:

- Executed tests confirm expected behavior for the tested features.
- Invalid requests are rejected appropriately.
- Authentication and authorization checks behave as expected.
- Data persistence checks pass.
- No unexplained failures remain in the executed test suites.

Features that have not been tested must be reported as unverified, not passed.

### 6.2 Database Acceptance Criteria

Database verification is successful when:

- Required migrations complete successfully.
- The application can connect to the test database.
- Tested create, read, update, and delete operations behave as expected.
- Relevant constraints and relationships are preserved.
- No unexplained data-integrity failures occur.

### 6.3 Performance Acceptance Criteria

The following criteria are based on `docs/backend-requirements.md`.

- **NFR-PERF-01 — Standard API latency:** Under a documented baseline test with 50 concurrent virtual users and a representative dataset, at least 95% of ordinary database-backed API requests must complete within 500 ms, excluding external-provider latency.
- **NFR-PERF-02 — Geographic search latency:** Under the same documented baseline conditions, at least 95% of radius and area search requests must complete within 1 second. Record the test dataset size, index configuration, and query parameters.
- **Proposed HTTP error-rate target:** An HTTP error rate of no more than 0.1% is a proposed engineering target. It is not an explicitly stated threshold in the inspected performance requirements and requires separate approval.
- **NFR-PERF-03 — Concurrent request correctness:** The defined workload with 50 concurrent virtual users must complete without duplicate records caused by the tested operations, data corruption, or unhandled server exceptions.

Evaluate each criterion using recorded test evidence. Do not mark a criterion as passed until the corresponding test has been executed.

The performance targets are provisional and should be reviewed after representative load tests, as stated in `docs/backend-requirements.md`.

### 6.4 Security Acceptance Criteria

Security verification is successful for the tested cases when:

- Protected endpoints reject unauthenticated requests.
- Authorization rules prevent unauthorized access to tested resources.
- Invalid and expired tokens are handled correctly.
- Passwords are not stored in plaintext.
- Test responses do not expose unexpected sensitive information.
- Dependency audit findings are documented and reviewed.

These checks do not replace a comprehensive security audit.

### 6.5 Reliability Acceptance Criteria

Reliability verification is successful for the tested scenarios when:

- Required services start and respond to health checks.
- Expected error cases are handled without unhandled process crashes.
- Database persistence remains correct across the tested operations.
- External-service failures are handled according to the implemented fallback behavior, where applicable.

### 6.6 Verification Status

Use the following status values in the final report:

- **Passed:** The test was executed and met its acceptance criteria.
- **Failed:** The test was executed and did not meet its acceptance criteria.
- **Blocked:** The test could not be completed because of an environment, dependency, or tooling problem.
- **Not Run:** The test has not been executed.
- **Proposed:** The test or threshold has been suggested but has not yet been approved or implemented.

---

## 7. Reporting and Deliverables

### 7.1 Required Deliverables

The verification report should contain:

- Git commit and environment details.
- Test types and commands executed.
- Automated test results.
- API and health-check results.
- Database verification results.
- Security and dependency audit findings.
- Performance measurements.
- Baseline and candidate comparison.
- Known limitations and unresolved issues.
- Final verification status.

### 7.2 Test Results Summary

Complete this table after execution.

| Test category          | Status  | Evidence or notes |
| ---------------------- | ------- | ----------------- |
| Unit tests             | Not Run | TBD               |
| Integration tests      | Not Run | TBD               |
| API and contract tests | Not Run | TBD               |
| End-to-end tests       | Not Run | TBD               |
| Database verification  | Not Run | TBD               |
| Security checks        | Not Run | TBD               |
| Health checks          | Not Run | TBD               |
| Performance tests      | Not Run | TBD               |
| Baseline comparison    | Not Run | TBD               |

Update each status only after collecting evidence.

### 7.3 Defect Reporting

For each failure, record:

- A short description.
- The affected service or endpoint.
- Steps to reproduce.
- Expected behavior.
- Actual behavior.
- Relevant logs or error output.
- Severity and impact.
- Whether the failure also occurs on the baseline.

Do not include passwords, tokens, or other secrets in defect reports.

### 7.4 Limitations

Document limitations that may affect interpretation of the results, including:

- Missing or incomplete automated tests.
- Unavailable external services.
- Unverified test scripts.
- Differences between local and production environments.
- Insufficient hardware or test data.
- Unavailable baseline results.
- Proposed thresholds that have not been approved.

---

## 8. Practical Execution Sequence

### Phase 1: Inspect the Repository

- Verify available scripts in the root and service-level `package.json` files.
- Inspect the backend requirements.
- Inspect the database configuration and migration scripts.
- Inspect the end-to-end verification script.
- Record the selected Git commit.

### Phase 2: Prepare Infrastructure

- Start the required database and infrastructure.
- Verify database health.
- Apply migrations.
- Confirm required environment variables are present.

### Phase 3: Run Automated Tests

- Execute the verified unit and integration test scripts.
- Execute available API tests.
- Record all results and failures.

### Phase 4: Run E2E Verification

- Ensure ports 4000–4008 are available.
- Confirm that the database and required environment variables are configured.
- Execute `node scripts/verify-e2e-runtime.js`.
- Record service startup, health checks, and workflow results.

### Phase 5: Run Runtime Health Checks

- Start the backend using the verified development command.
- Execute `npm run health:check`.
- Record service status and response times.

### Phase 6: Run Security Checks

- Execute the available dependency audit.
- Verify authentication and authorization behavior.
- Record findings and limitations.

### Phase 7: Run Performance Tests

- Test the baseline and candidate under equivalent conditions.
- Use the proposed workload or record any deviation.
- Perform three measurement runs per version.
- Record latency, throughput, error rate, and resource usage.

### Phase 8: Evaluate Results

- Compare results against approved requirements.
- Separate measured results from proposed targets.
- Document regressions and unresolved issues.
- Assign a status to each verification category.

### Phase 9: Prepare the Report

- Summarize the environment and commands.
- Include evidence for passed and failed tests.
- List blocked and unexecuted tests.
- Include baseline comparison results if available.
- State whether the acceptance criteria were met.

---

## 9. Baseline Definition

### 9.1 Baseline Commit

The baseline for this verification plan is:

`f0560f9651e54346d66b147a7b784ab5580ac324`

Use this commit as the reference version for comparative testing, subject to confirming that it can be built and started in the selected environment.

### 9.2 Candidate Version

The candidate version is the commit containing the backend changes to be evaluated.

Record the exact candidate commit before running tests.

### 9.3 Comparison Rules

To compare the baseline and candidate fairly:

1. Use equivalent hardware and runtime settings.
2. Use equivalent database schemas and test data.
3. Use the same endpoint set and request distribution.
4. Use identical warm-up and measurement durations.
5. Perform three runs for each version.
6. Report all runs and their errors.
7. Investigate significant changes before concluding that one version is better.

If the baseline cannot be executed, document the reason and mark the comparison as blocked.

### 9.4 Baseline Results

Baseline measurements have not been entered into this document.

| Metric                            | Baseline result |
| --------------------------------- | --------------- |
| Unit and integration test results | TBD             |
| API response latency              | TBD             |
| Geospatial query latency          | TBD             |
| Throughput                        | TBD             |
| HTTP error rate                   | TBD             |
| Resource consumption              | TBD             |
| Environment limitations           | TBD             |

These fields must be populated only from actual test output.

---

## 10. Final Verification Checklist

Before declaring backend verification complete, confirm that:

- [ ] The repository commit and test environment are recorded.
- [ ] Test commands have been verified against the repository.
- [ ] Required infrastructure and database services are healthy.
- [ ] Database migrations complete successfully.
- [ ] Available automated tests have been executed.
- [ ] API and health-check results are recorded.
- [ ] End-to-end test prerequisites have been satisfied.
- [ ] Security findings are documented.
- [ ] Performance conditions are recorded.
- [ ] Baseline and candidate results are compared where possible.
- [ ] Proposed targets are distinguished from approved requirements.
- [ ] Unexecuted and blocked tests are clearly identified.
- [ ] No test is reported as passed without evidence.

## 11. Conclusion

This plan defines a repeatable approach for verifying the FishMap backend through functional, integration, API, database, security, reliability, and performance testing.

The baseline commit provides a reference point for comparison, while the specified workload defines proposed measurement conditions for evaluating performance.

The plan is a verification procedure, not a report of completed test execution. Actual results, acceptance status, and performance conclusions must be added only after the corresponding tests have been performed and their evidence recorded.
