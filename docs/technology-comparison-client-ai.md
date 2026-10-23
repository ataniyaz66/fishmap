# Technology Comparison: Mobile Client and AI Module

**Author:** Bibifatima Biysheva
**Scope of this document:** key technology decisions for the mobile application and the AI component. Decisions for the server side (backend platform, database, component interaction) are described in a separate document by the co-author.

## 1. How the decisions are made

Each alternative is compared against the project requirements (see `requirements-client-ai.md`). The criteria differ between decisions and are listed in each section. Statements about the current state of the project (what is already used in the repository) are taken from `frontend/flutter_app/pubspec.yaml`. Statements about third-party tools describe their general characteristics; exact limits, prices, and licence terms must be checked on the official pages before final use.

## 2. Summary of decisions

| # | Decision | Chosen option | Status |
|---|---|---|---|
| 1 | Mobile application framework | Flutter | In use in the repository |
| 2 | Map library and map data | `flutter_map` with open map tiles | In use (`flutter_map`, `latlong2`); tile provider to be fixed |
| 3 | State management and local storage | Provider; secure storage for tokens | `provider` and `shared_preferences` in use; secure storage to be added |
| 4 | Fish species recognition approach | Fine-tuned pretrained image classifier | Proposed; to be confirmed by experiments |
| 5 | Where the model runs | Server-side first, on-device as a later option | Proposed; to be confirmed with the co-author |

## 3. Decision 1: Mobile application framework

**Relevant requirements:** NFR-C05 (cross-platform), NFR-C01 (usability), FR-C03 (interactive map), the project title (cross-platform system), and the limited time of a two-person team.

| Criterion | Flutter | React Native | Native Android (Kotlin) |
|---|---|---|---|
| One code base for Android and iOS | Yes | Yes | No (Android only; iOS needs a separate app) |
| Language | Dart | JavaScript / TypeScript | Kotlin |
| Ready map libraries | Several (including `flutter_map`) | Several | Several |
| Fit with the existing repository | Already used (`frontend/flutter_app`) | Would require starting over | Would require starting over |
| Effort for a two-person team | Low to medium | Low to medium | Higher if iOS is needed |
| Access to camera and gallery for catch photos | Through packages | Through packages | Direct |

**Choice: Flutter.** It satisfies the cross-platform requirement with one code base, and the client skeleton in the repository already uses it, so changing the framework would only cost time. The trade-off is that the team works with Dart, and some platform features need additional packages.

## 4. Decision 2: Map library and map data

**Relevant requirements:** FR-C03 – FR-C06 (map and spots), NFR-C05 (compatibility), cost and access constraints of a student project.

| Criterion | `flutter_map` + open tiles (OpenStreetMap-based) | Google Maps (`google_maps_flutter`) | Mapbox |
|---|---|---|---|
| Account or API key | Not required for the library; a tile provider may require a key | Required, billing account is needed | Required (access token) |
| Cost for a student project | No licence cost for the library | Usage is limited by the platform's pricing terms | Usage is limited by the platform's pricing terms |
| Customization of map style and markers | Good: layers and markers are widgets | Good, within the provider's options | Very good |
| Fit with the existing repository | Already used (`flutter_map`, `latlong2`) | Would require replacing the map code | Would require replacing the map code |
| Risk | Public community tile servers are not meant for heavy use; a dedicated tile provider will be needed for a real release | Dependence on billing and key restrictions | Dependence on account and usage limits |

**Choice: `flutter_map` with open map tiles.** It needs no billing for development, is already integrated, and is enough for markers, spot selection, and photo previews. The tile source for demonstration and testing must be fixed and its usage terms checked; for any public release a dedicated provider should be used.

## 5. Decision 3: State management and local storage

**Relevant requirements:** NFR-C04 (security of client data), NFR-C06 (error handling), maintainability of the client code.

| Criterion | Provider | Riverpod | Bloc |
|---|---|---|---|
| Learning curve | Low | Medium | Medium to high |
| Amount of code for a medium app | Low | Low to medium | Higher (more structure) |
| Fit with the existing repository | Already used (`provider`) | Would require migration | Would require migration |
| Testability | Good | Good | Very good |

**Choice: Provider.** It is the simplest option that is already in use and is sufficient for the planned number of screens.

**Local storage.** The repository currently uses `shared_preferences`, which is suitable for simple settings but is not intended for secrets. To meet NFR-C04, authentication tokens should be kept in a secure storage package (for example, one based on the platform keystore), while `shared_preferences` remains for non-sensitive settings. This is added to the task list.

## 6. Decision 4: Fish species recognition approach

**Relevant requirements:** AI-01 (classification), AI-02 (target accuracy), AI-03 (low-confidence handling), AI-04 (documented datasets), FR-C08 (species suggestion).

| Criterion | Fine-tuning a pretrained image classifier (transfer learning) | Training a small CNN from scratch | General multimodal LLM through an API (zero-shot) |
|---|---|---|---|
| Data needed | Moderate: a labelled fish dataset | Large | None for the model; labelled data only for evaluation |
| Control over supported species | Full | Full | Limited: answers are free-form |
| Measurable accuracy on a fixed test set | Yes | Yes | Yes, but output needs parsing and varies |
| Confidence values for FR-C08 / AI-03 | Class probabilities are available | Class probabilities are available | No calibrated confidence |
| Running cost | Low after training | Low after training | Per-request cost and dependence on a provider |
| Effort | Medium | High | Low |

**Choice: fine-tuning a pretrained image classifier.** It needs less data and time than training from scratch, gives class probabilities that the requirements use (confidence, threshold for unreliable cases), and keeps the list of supported species under the team's control. The LLM approach is useful as a **comparison baseline** in the evaluation (see the verification plan), because it requires no training. The exact model family and dataset are selected in the first experiments, and the choice is recorded together with the measured results and dataset licences (AI-04).

## 7. Decision 5: Where the species model runs

**Relevant requirements:** NFR-C02 (performance), NFR-C06 (behaviour without network), AI-03, integration with the existing backend.

| Criterion | Server-side inference (AI service) | On-device inference |
|---|---|---|
| Works without network | No | Yes |
| Integration with the existing backend | Direct, same API | Requires converting and packaging the model |
| Updating the model | Simple (server only) | Requires an app update or model download |
| Device requirements | None | Depends on the device |
| Effort | Lower | Higher |

**Choice: server-side first.** It integrates directly with the existing AI service and allows quick model updates during experiments. Anglers often fish where the network is weak, so on-device inference is kept as a possible later improvement and noted in the project risks.

## 8. Open points

- Fix the map tile source and check its usage terms.
- Select the model family and dataset after the first experiments; document licences.
- Confirm with the co-author how the Python-trained model will be served next to the existing backend services.
- Add secure token storage on the client.
