# Requirements Specification: Mobile Client and AI Module

**Author:** Bibifatima Biysheva
**Scope of this document:** requirements for the mobile application and the AI component (fish species recognition, recommendations). Backend and non-functional requirements of the server side are described in a separate document by the co-author.

## 1. Sources of requirements

| Source | Status |
|---|---|
| Project proposal (`proposal.md`) | Initial assumptions about user needs |
| User interviews (`relevance-evidence.md`) | Verified findings; priorities are adjusted after the discussions |
| Existing system comparison (`system-comparison.md`) | Gaps and common features of existing apps |

Priorities follow the MoSCoW scale: **Must**, **Should**, **Could**. Priorities and acceptance criteria are initial and will be revised after the interviews and the baseline measurements.

## 2. Functional requirements

### 2.1 Account and profile

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---|---|
| FR-C01 | The user can register and log in from the mobile app. | Must | A new user can create an account and log in; wrong credentials show an error message and do not grant access. |
| FR-C02 | The user can view and edit their profile (name, bio, location, avatar). | Must | Changes made in the profile are saved and shown after restarting the app. |

### 2.2 Map and fishing spots

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---|---|
| FR-C03 | The app shows an interactive map with fishing spots. | Must | The map loads, can be moved and zoomed, and displays markers for saved spots. |
| FR-C04 | The user can add a fishing spot by choosing a point on the map and entering a name and description. | Must | A new spot appears on the map immediately and is still there after restarting the app. |
| FR-C05 | The user can attach photos to a spot. | Should | A photo selected for a spot is displayed in the spot details. |
| FR-C06 | The user can set a spot as private or visible to friends. | Should | A private spot is not visible to another user's account. |

### 2.3 Catches and fish species recognition

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---|---|
| FR-C07 | The user can add a catch with a photo, species, size/weight, date, and spot. | Must | A saved catch is shown in the user's list with all entered fields. |
| FR-C08 | The app suggests the most probable fish species from a catch photo. | Must | After a photo is selected, the app shows at least one suggested species with a confidence value; the user can accept or change it. |
| FR-C09 | The user can view their catch history and personal statistics (number of catches, species, best spots). | Should | Statistics change after a new catch is added and match the stored catches. |

### 2.4 Equipment inventory

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---|---|
| FR-C10 | The user can add, edit, and delete equipment items (lures, rods, reels, line). | Must | Each operation is reflected in the inventory list after refresh. |
| FR-C11 | The user can set visibility of the inventory and of individual items (private / friends). | Should | An item marked private is not shown to other users. |

### 2.5 Social features

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---|---|
| FR-C12 | The user can find other users, send friend requests, and accept or decline them. | Should | After a request is accepted, both users see each other in the friends list. |
| FR-C13 | The user receives notifications about friend requests and activity. | Could | A notification is shown after a friend request is received. |

### 2.6 Weather, regulations, and recommendations

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---|---|
| FR-C14 | The app shows weather for the selected spot and time. | Should | Weather data (temperature, wind, pressure) is displayed for the chosen spot. |
| FR-C15 | The app shows fishing rules for the area (seasons, protected species, size and catch limits) when such data is available. | Could | Rules are displayed for at least one pilot region or the app states that the data is not available. |
| FR-C16 | The app offers personalized recommendations (e.g. lure suggestions based on the user's inventory and conditions). | Should | A recommendation is shown based on the user's inventory; recommendations change if the inventory changes. |

## 3. AI module requirements

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---|---|
| AI-01 | The module classifies a fish photo into one of the supported species. | Must | For a test set of photos, the module returns a species and confidence for each photo; the list of supported species is documented. |
| AI-02 | The module reaches a target classification accuracy on a held-out test set. | Must | Accuracy is measured on a test set not used for training and compared with the baseline; the initial target value is set after the first baseline measurement. |
| AI-03 | The app handles low-confidence or unsupported images. | Should | If confidence is below a threshold, the app says that the species could not be determined reliably and asks the user to choose manually. |
| AI-04 | Dataset sources and licences are documented. | Must | Each dataset used has a recorded source, size, and licence in the documentation. |

## 4. Non-functional requirements (client and AI)

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---|---|
| NFR-C01 | **Usability.** A new user can complete the main scenarios (register, add a spot, add a catch) without instructions. | Must | In a usability check with several test users, each completes these scenarios without help from the team; observed problems are recorded. |
| NFR-C02 | **Performance.** Main screens respond quickly under normal network conditions. | Should | Screen loading and species suggestion times are measured and recorded; the target values are set after the first measurements. |
| NFR-C03 | **Privacy.** Private spots and inventory items are never shown to other users. | Must | Tests with two accounts confirm that private data is not visible to the other account. |
| NFR-C04 | **Security of client data.** Passwords and tokens are not stored in plain text on the device or in the repository. | Must | Code review and repository check show no passwords or keys in source files. |
| NFR-C05 | **Compatibility.** The app runs on at least one mobile platform (Android) and is built to be cross-platform. | Must | The app is installed and its main scenarios are run on a physical device or an emulator. |
| NFR-C06 | **Error handling.** The app shows understandable messages when the network or server is not available. | Should | With the server turned off, the app shows an error message and does not crash. |

## 5. Traceability

| Requirement group | Related project objective (see proposal) |
|---|---|
| FR-C01 – FR-C02 | Objectives 4, 5 (authentication, mobile application) |
| FR-C03 – FR-C06 | Objectives 4, 5 (spots and map) |
| FR-C07 – FR-C09, AI-01 – AI-04 | Objectives 5, 6, 7 (catches, species recognition, evaluation) |
| FR-C10 – FR-C11 | Objective 5 (inventory) |
| FR-C12 – FR-C13 | Objective 5 (social features) |
| FR-C14 – FR-C16 | Objective 6 (recommendations) |
| NFR-C01 – NFR-C06 | Objectives 5, 7 |

## 6. Open points

- Priorities will be adjusted after the user interviews (`relevance-evidence.md`).
- Target values for model accuracy and response times will be fixed after the baseline measurements (see the verification plan).
- The mobile platform and framework are selected in the technology comparison.
