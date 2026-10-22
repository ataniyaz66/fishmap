# Project Proposal

## 1. Project title

**Development of a Cross-Platform Intelligent System for Planning, Tracking and Analyzing Recreational Fishing** (FishMap)

- RU: Разработка кроссплатформенной интеллектуальной системы для планирования, отслеживания и анализа любительской рыбалки
- KZ: Әуесқой балық аулауды жоспарлауға, бақылауға және талдауға арналған кроссплатформалық зияткерлік жүйені әзірлеу

## 2. Team and supervisor

| Member | Responsibility |
|---|---|
| Bibifatima Biysheva | UI/UX design, mobile application, fish species recognition from a photo, personalized recommendations (participation), client–backend and AI integration, mobile testing, user documentation |
| Ataniyaz Mutigolla | Server architecture, database design, authentication, REST API, data storage and processing, integration with map services, backend testing, technical documentation |

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
3. Design the system architecture, the database and the user interface (diagrams and a prototype of key scenarios).
4. Develop the backend: authentication, REST API for profiles, spots, catches, friends and equipment, data storage.
5. Develop the mobile application: interactive map, profile, friends, inventory, catches with photos.
6. Develop and integrate a model that suggests the fish species from a photo; implement personalized recommendations.
7. Test the system and evaluate the results against defined metrics and a baseline solution.
8. Prepare technical and user documentation.

## 7. Expected outcomes

- A working mobile application integrated with the backend.
- A backend with a database, authentication and an API.
- A fish species recognition model embedded in the application.
- Personalized recommendations based on user activity.
- Requirements, architecture, test results and documentation stored in the project repository.
- Individual results of each team member that can be assessed separately (mobile client and AI component; backend and data layer).

## 8. Project scope

**Planned feature priorities** (to be refined in the requirements specification):

**Must have**
- Registration, authentication, user profile
- Interactive map and fishing spots with photos
- Catch records with photos and details
- Equipment (lure) inventory with privacy settings
- Fish species recognition from a photo
- Mobile application and backend API

**Should have**
- Friends and search for anglers by interests
- Personal statistics and fishing journal
- Weather for a place and time
- Fishing regulations: seasons, protected species, size and catch limits
- Personalized recommendations
- Notifications

**Could have**
- Fishing groups, group chats, shared spots and catches, group trips and events
- Leaderboards, monthly challenges, top anglers by location
- Web/desktop dashboard, admin panel, reports and moderation

**Out of scope:** a production-ready release for public use (app store publication, high-load operation, legal review of fishing regulation data for all regions).

## 9. Engineering complexity

The project combines several non-trivial engineering areas:

- Client–server architecture with authentication and a REST API.
- Geospatial data: an interactive map and location-based records.
- Computer vision: classification of fish species from photos, including dataset preparation and model evaluation.
- Recommendation functionality based on user data.
- Privacy settings for equipment and places.
- Integration of the mobile client, backend and AI component.

## 10. Risks to scope

| Risk | Mitigation |
|---|---|
| The feature list is large for a team of two | Prioritization (Must / Should / Could); social and competitive features are optional |
| Lack of a suitable dataset for fish species recognition | Review existing datasets early; reduce the number of species; document accuracy limits |
| Dependence between the mobile client and backend | Agree on the API contract early; use mock data for client development |

*A full risk register is maintained in `project-management.md`.*
