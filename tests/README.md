# FishMap Monorepo & Integration Tests

This directory contains cross-cutting integration test suites, end-to-end verification scripts, and multi-service testing workflows for the FishMap platform.

## Testing Architecture

- **Microservice Unit & Integration Tests:** Located within each service directory under `backend/services/<service>/tests/` and executed via `npm test`.
- **API Gateway Tests:** Located in `backend/gateway/tests/`.
- **Frontend Tests:** Located in `frontend/flutter_app/test/` and executed via `npm run flutter:test`.
- **Cross-Service Scenarios:** End-to-end live verification scripts (e.g., `scripts/verify-full-features.js`) and cross-domain contract verification.
