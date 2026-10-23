# Risks and Dependencies

**Authors:** Bibifatima Biysheva, Ataniyaz Mutigolla
**Task:** FIS-9
**Status:** initial version; reviewed and updated before each pre-defense.

Probability and impact are initial judgements on a three-level scale (Low / Medium / High). They are revised when new information appears (for example, after the first dataset check).

## 1. Risk register

| ID | Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | **Scope is too large** for a team of two (many planned features). | High | High | Keep MoSCoW priorities; fix which features are included in the first defense and which are postponed (competitions, group chats, admin panel); re-check scope at each milestone. | Both |
| R2 | **No suitable fish dataset**: too few photos, poor quality, unclear licence, or species relevant to the region are missing. | Medium | High | Check datasets early (by the end of November); document source, size, and licence; reduce the number of supported species if needed; add own photos where licences allow. | Fatima |
| R3 | **Model accuracy is too low**, especially for visually similar species. | Medium | High | Show top-3 suggestions and let the user confirm; apply a confidence threshold with manual choice (AI-03); compare with baselines and report limitations honestly. | Fatima |
| R4 | **Individual contributions are not visible** in the repository history (large commits, shared work). | Medium | High | Describe who did what; work in small commits from personal accounts; every change goes through a Pull Request linked to a YouTrack task and reviewed by the other member. | Both |
| R5 | **Secrets or personal data are published** in the public repository. | Medium | High | Keep `.gitignore` and `.env.example` up to date; check the repository before each pre-defense tag; store client tokens in secure storage. | Ataniyaz (repository), Fatima (client) |
| R6 | **Client and backend get out of sync** (API changes break the client). | Medium | Medium | Keep API descriptions up to date; agree on changes through tasks; use test data on the client; run health checks and end-to-end scripts before demonstrations. | Both |
| R7 | **External services are unavailable or limited** (weather API, map tiles, external AI service). | Medium | Medium | Use caching and fallback modes where they exist; choose and document the tile provider and check its usage terms; do not make core features depend only on an optional external service. | Both |
| R8 | **Fishing regulation data for Kazakhstan is not available or is not reliable.** | High | Medium | Identify a data source and a responsible person; start with a pilot region and show the data source in the app; if no reliable source exists, move the feature out of the priority list. | Fatima |
| R9 | **Evidence of relevance is limited** (few interviews). | Medium | Medium | Hold additional discussions; mark unconfirmed statements as hypotheses; adjust priorities when new findings appear. | Both |
| R10 | **Time constraints** during the exam period and because of other coursework. | High | Medium | Plan milestones with a buffer; keep tasks small; review progress weekly in YouTrack. | Both |

## 2. Dependencies

| Dependency | Depends on | Why it matters |
|---|---|---|
| Mobile client features (spots, catches, inventory, friends) | Backend API and database | The client reads and writes data through the API |
| Species suggestion in the client | AI module and the trained model | The client shows suggestions returned by the model |
| Training the model | Dataset with documented licence | No dataset, no model and no evaluation |
| Weather in the client | Weather service and external weather API | Weather data is requested through the backend |
| Map screens | Map library and tile provider | A tile provider must be fixed for demonstrations |
| Verification of requirements | Test environment (running backend, test accounts) | Scenario tests need the running system |
| Final evaluation | Held-out test set prepared before training | Prevents mixing training and test data |

## 3. Review of risks

- Risks are reviewed before each pre-defense and when a milestone is missed.
- New risks and changes are recorded with the date in this file; closed risks stay in the table with the note "closed" and the reason.
