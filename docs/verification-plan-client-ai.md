# Verification and Evaluation Plan: Mobile Client and AI Module

**Author:** Bibifatima Biysheva
**Scope of this document:** how the requirements for the mobile application and the AI component (`requirements-client-ai.md`) will be verified, and how the achievement of the project aim will be demonstrated. Verification of the server side is described in a separate document by the co-author.

## 1. Verification approach

| Level | What is checked | Method |
|---|---|---|
| Component | Individual functions and widgets of the client | Automated unit and widget tests |
| Integration | Client working with the backend and the AI service | Scripted scenarios against a running backend; two-account checks for privacy |
| Model | Quality of fish species recognition | Evaluation on a held-out test set, comparison with baselines |
| User | Whether people can use the main scenarios | Usability check with test users |

Each requirement from `requirements-client-ai.md` is assigned a verification method in section 7.

## 2. Client testing

**Automated tests**
- Unit tests for data models, input validation, and API response handling.
- Widget tests for key screens (login, add spot, add catch, inventory list).
- Tests run with the standard Flutter test command; results are recorded in the repository.

**Scenario tests against the backend** (manual or scripted, on an emulator or a physical device):

| Scenario | Related requirements |
|---|---|
| Register, log in, log out; wrong credentials | FR-C01 |
| Edit profile and restart the app | FR-C02 |
| Open the map, add a spot, restart the app | FR-C03, FR-C04 |
| Add a catch with a photo and see it in the list | FR-C07 |
| Add, edit, delete an inventory item | FR-C10 |
| Mark a spot and an item as private; check with a second account | FR-C06, FR-C11, NFR-C03 |
| Send and accept a friend request | FR-C12 |
| Turn the server off and use the app | NFR-C06 |

**Security check:** search the repository and the client code for passwords, tokens, and keys; confirm that tokens are not stored in plain text (NFR-C04).

## 3. Model evaluation

### 3.1 Data and splits
- The datasets, their sources, sizes, and licences are recorded before training (AI-04).
- The data is divided into training, validation, and test parts. The test part is used only for the final measurements.
- Photos of the same fish, the same source, or the same photographer are kept in one part only, so that near-duplicates do not leak from training into testing.
- The list of supported species is fixed and documented before the final evaluation (AI-01).

### 3.2 Metrics

| Metric | Why it is used | Related requirement |
|---|---|---|
| Top-1 accuracy | Share of photos where the first suggestion is correct | AI-02 |
| Top-3 accuracy | Share of photos where the correct species is among the three suggestions shown to the user | AI-02, FR-C08 |
| Per-class precision and recall, confusion matrix | Shows which species are confused and whether some classes are much weaker | AI-02 |
| Behaviour at the confidence threshold | Share of photos marked as unreliable, and accuracy on the rest | AI-03 |
| Inference time | Time from sending a photo to receiving a suggestion | NFR-C02 |

### 3.3 Measurement conditions
- The same test set and the same preprocessing are used for all compared solutions.
- Inference time is measured on the same machine or server, with the same image size, and repeated several times; the median and the spread are reported.
- Photos in the test set include different lighting, angles, and backgrounds typical for fishing photos. Cases with poor quality are reported separately.
- Results are reported with the dataset version, the model version, and the commit of the code that produced them.

### 3.3.1 Target values
Target values for accuracy and response time are **not fixed in advance**. They are set after the first baseline measurement, discussed with the supervisor, and then recorded in `requirements-client-ai.md` (AI-02, NFR-C02). This avoids setting targets that are not based on measured results.

## 4. Baseline solutions for comparison

| Baseline | Purpose |
|---|---|
| Most frequent class (predicting the most common species) | Lower bound: shows how much the model learns beyond class frequency |
| Pretrained image classifier without fine-tuning on fish data (where applicable) | Shows the benefit of fine-tuning |
| General multimodal LLM used through an API with a fixed prompt and the same list of species | Shows how the trained model compares with a solution that needs no training; limitations: no calibrated confidence, output must be parsed |

The proposed model is considered successful if it is clearly better than the baselines on the same test set and meets the target values fixed after the first measurement.

## 5. Usability check

- **Participants:** several people, preferably not on the project team, including at least one person who does not fish regularly.
- **Tasks:** register, add a fishing spot, add a catch with a photo, add an equipment item.
- **Measured:** whether each task was completed without help, time per task, and problems observed. Problems are recorded and used to change the interface.
- **Condition:** participants get no instructions beyond the task text.

## 6. How achievement of the aim will be demonstrated

The aim of the project is to develop a cross-platform intelligent system that helps anglers plan trips, record catches, and analyze results. It is considered achieved if:

1. All **Must** requirements pass their verification (section 7).
2. The species recognition model is better than the baselines on the held-out test set and meets the target values fixed after the first measurement.
3. The usability check shows that the main scenarios can be completed without help, and found problems are either fixed or recorded.
4. The client and the backend work together in the demonstrated scenarios, and the results are stored in the repository.

## 7. Traceability: requirements and verification

| Requirement | Verification method |
|---|---|
| FR-C01, FR-C02 | Scenario tests, widget tests |
| FR-C03, FR-C04, FR-C05 | Scenario tests |
| FR-C06, FR-C11, NFR-C03 | Two-account privacy check |
| FR-C07 | Scenario test with a photo |
| FR-C08, AI-01, AI-03 | Model evaluation; scenario test of the species suggestion screen |
| AI-02 | Model evaluation on the test set, comparison with baselines |
| AI-04 | Documentation check: sources and licences recorded |
| FR-C09 | Scenario test: statistics change after a new catch |
| FR-C10 | Scenario test, widget tests |
| FR-C12, FR-C13 | Scenario test with two accounts |
| FR-C14, FR-C15, FR-C16 | Scenario tests |
| NFR-C01 | Usability check |
| NFR-C02 | Time measurements |
| NFR-C04 | Repository and code check |
| NFR-C05 | Running the app on a device or an emulator |
| NFR-C06 | Scenario test with the server turned off |

## 8. Records and schedule

- Test results, evaluation tables, and model versions are stored in the repository (`tests/` and `docs/`).
- First baseline measurement: after the dataset is prepared.
- Usability check: after the main screens of the client work.
- Results are updated before each pre-defense, and the repository is tagged for each submission.
