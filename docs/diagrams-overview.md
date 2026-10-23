# Architecture Diagrams: Overview

Editable sources are stored in [`diagrams/`](../diagrams/) as PlantUML text files (`.puml`). Rendered images (`.png`) are stored next to them. To edit a diagram, change the `.puml` file and render it again with PlantUML (for example `plantuml -tpng diagrams/use-case.puml`, or the online PlantUML server).

| Diagram | Source | Export |
|---|---|---|
| System context | [`system-context.puml`](../diagrams/system-context.puml) | [`system-context.png`](../diagrams/system-context.png) |
| Use case | [`use-case.puml`](../diagrams/use-case.puml) | [`use-case.png`](../diagrams/use-case.png) |
| Component (draft) | to be added by the backend author | to be added |

## 1. System context diagram

![System context diagram](../diagrams/system-context.png)

The diagram shows FishMap as one system with its user and the external systems it depends on:

- **Angler** uses the system to plan trips, record spots, catches and equipment, and to view statistics and recommendations.
- **Map provider** supplies map tiles and geodata for the interactive map.
- **Weather service** (Open-Meteo API) supplies weather data for a spot and time.
- **External AI service** (LLM API) is an optional dependency of the fishing assistant.

The internal structure (mobile client, backend services, database, AI module) is shown in the component diagram.

## 2. Use case diagram

![Use case diagram](../diagrams/use-case.png)

The diagram shows the main scenarios of the angler and where external systems take part:

- Core scenarios: registration and login, profile, map, adding spots, adding catches with photos, equipment inventory, privacy settings.
- **Get species suggestion from photo** extends **Add catch with photo**; the AI module takes part in it.
- **Get personalized recommendations** uses the AI module; **View weather** uses the weather service.
- Social scenarios: friends, notifications.

## 3. Consistency with requirements

| Use case | Related requirements (see `requirements-client-ai.md`) |
|---|---|
| Register / log in | FR-C01 |
| Manage profile | FR-C02 |
| View interactive map | FR-C03 |
| Add fishing spot | FR-C04, FR-C05, FR-C06 |
| Add catch with photo | FR-C07 |
| Get species suggestion from photo | FR-C08, AI-01 – AI-04 |
| View statistics and fishing journal | FR-C09 |
| Manage equipment inventory | FR-C10 |
| Set privacy of spots and inventory | FR-C06, FR-C11, NFR-C03 |
| Find anglers and manage friends | FR-C12 |
| Receive notifications | FR-C13 |
| View weather for spot and time | FR-C14 |
| Get personalized recommendations | FR-C16 |
