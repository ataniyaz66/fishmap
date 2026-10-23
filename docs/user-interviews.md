# User Interviews and Empirical Findings

## 1. Introduction and Objectives

This document records empirical findings from semi-structured qualitative user interviews conducted for the FishMap project. The objective of these interviews is to investigate recreational anglers' real-world habits, information discovery methods, gear selection criteria, catch recording practices, spot-sharing preferences, and functional expectations. The resulting insights provide initial qualitative evidence to explore project assumptions and help identify preliminary candidate requirements.

### Methodological Context
- **Date of Interviews:** 23 October 2026
- **Methodology:** Semi-structured qualitative user interviews
- **Participants:** Two recreational anglers representing distinct levels of experience (P1: lifelong experienced angler; P2: intermediate angler with three years of experience)
- **Epistemological Status:** Information recorded reflects participant-reported statements, personal experiences, and individual perspectives. Self-reported behaviors are treated as qualitative user perspectives rather than independently verified facts, and inferred requirements are strictly preliminary.

---

## 2. Interview 1: Experienced Angler (P1)

### 2.1 Participant Profile
- **Participant ID:** P1
- **Age:** Approximately 40 years old
- **Experience Level:** Fishing since childhood
- **Interview Date:** 23 October 2026

### 2.2 Findings Grouped by Topic

#### A. Location Selection and Navigation
- P1 chooses fishing locations according to target fish species and local water knowledge.
- P1 uses fish finders and navigation technology to examine underwater terrain, depth, fish locations, and previously productive spots.

#### B. Equipment and Tackle Selection
- P1 selects equipment according to whether the target is predatory or non-predatory fish (e.g., feeder, float, spinning).

#### C. Technology and Tool Usage
- P1 uses smartphone weather forecasts and fish-finder/navigation devices.
- P1 values underwater information and real-time lure visibility in the water column.

#### D. Fish Species Identification and Regulations
- P1 noted that experienced anglers may identify fish by appearance, size, and movements.
- P1 emphasized local fishing regulations and protected species.

#### E. Spot Sharing and Privacy Preferences
- P1 does not want to share some highly productive locations, preserving confidentiality of preferred spots to protect fish stocks from overcrowding.

#### F. Suggested System Features and Logistical Points of Interest
- P1 suggested several features for an angling application:
  - Weather forecasts.
  - Fish activity information.
  - Fishing-location details.
  - Local regulations.
  - Recreation bases, emergency and rescue services, petrol stations, and tackle shops.
- P1 mentioned Ganyushkino and the "Kigach Fortuna" recreation base as specific regional examples.

### 2.3 Distinction: Participant-Reported Information vs. Inferred Requirements
- **Participant-Reported Information:** P1's statements represent self-reported preferences and personal angling routines (e.g., reliance on sonar/navigation devices, separate tackle for predatory vs. non-predatory fish, protective attitude toward productive spots, and interest in safety and logistical facilities). These statements reflect personal practice rather than independently verified data.
- **Inferred Requirements:** Functional requirements derived from P1's statements are preliminary interpretations designed to address the user's reported preferences in the software architecture.

### 2.4 Preliminary Requirements Inferred from Interview 1
- **REQ-01 (Private Fishing Spots):** The system must allow users to save private fishing spots that remain confidential and invisible to other users. *(Rationale: P1's refusal to share productive spots; Preliminary Priority: Must Have)*
- **REQ-02 (Map-Based Spot Discovery and Navigation Details):** The system must support interactive map visualization with fishing location details such as water type and depth. *(Rationale: P1's reliance on terrain and depth; Preliminary Priority: Must Have)*
- **REQ-03 (Integrated Weather and Barometric Forecasting):** The system should provide localized weather and atmospheric information relevant to fishing conditions. *(Rationale: P1's routine pre-trip weather checks; Preliminary Priority: Should Have)*
- **REQ-05 (Local Regulations and Protected Species Awareness):** The system should provide reference information on local fishing regulations, seasonal bans, and protected species. *(Rationale: P1's emphasis on legal compliance; Preliminary Priority: Should Have)*
- **REQ-06 (Nearby Facilities and Infrastructure Points of Interest):** The system could display nearby infrastructure such as recreation bases, petrol stations, and tackle shops. *(Rationale: P1's suggestion for trip logistics; Preliminary Priority: Could Have)*
- **REQ-07 (Emergency and Rescue Services Access):** The system could provide accessible emergency and rescue service contacts for remote fishing locations. *(Rationale: P1's suggestion regarding safety on water; Preliminary Priority: Could Have)*

---

## 3. Interview 2: Intermediate Angler (P2)

### 3.1 Participant Profile
- **Participant ID:** P2
- **Age:** 34 years old (male)
- **Experience Level:** 3 years of fishing experience
- **Interview Date:** 23 October 2026

### 3.2 Findings Grouped by Topic

#### A. Spot Discovery and Exploration
- P2 finds fishing spots through social media, asks acquaintances for recommendations, and explores random or unfamiliar locations.

#### B. Catch Logging and Utilization
- P2 takes photographs of catches on a smartphone but does not maintain detailed catch records.
- P2 keeps larger fish he considers tasty for food and releases others.

#### C. Weather Usage
- P2 checks the weather forecast before fishing.

#### D. Spot Sharing Behaviors
- P2 shares productive spots with close friends by going fishing together and showing them the location, rather than sharing coordinates digitally.

#### E. Tackle Assistance and Personalized Recommendations
- P2 expressed a strong desire for personalized recommendations based on his lure inventory, current weather, atmospheric pressure, and other relevant conditions.
- Specifically, P2 wants suggestions for lure color, size, and retrieval technique.

### 3.3 Distinction: Participant-Reported Information vs. Inferred Requirements
- **Participant-Reported Information:** P2's accounts describe personal habits (spot discovery via social media and friends, informal smartphone catch photography, weather checks before trips, in-person spot sharing, and selective harvesting of edible fish). These represent self-reported experiences.
- **Inferred Requirements:** The technical features proposed below represent preliminary software interpretations aimed at supporting P2's reported workflow (such as inventory-based recommendation algorithms and simplified photo-based catch recording).

### 3.4 Preliminary Requirements Inferred from Interview 2
- **REQ-01 (Private Fishing Spots):** The system must allow users to keep spot records private from the general public. *(Rationale: P2's preference for sharing spots only in trusted contexts; Preliminary Priority: Must Have)*
- **REQ-03 (Integrated Weather and Barometric Forecasting):** The system should display weather conditions and atmospheric pressure to assist with trip preparation. *(Rationale: P2's practice of checking weather forecasts; Preliminary Priority: Should Have)*
- **REQ-04 (Catch Photos and History Logging):** The system must support capturing and viewing catch photographs without requiring exhaustive manual logs. *(Rationale: P2's habit of taking catch photos without detailed logging; Preliminary Priority: Must Have)*
- **REQ-08 (Personalized Lure and Technique Recommendations):** The system should suggest lure choices (color, size) and retrieval techniques tailored to user inventory, ambient weather, and atmospheric pressure. *(Rationale: P2's explicit request for tackle guidance; Preliminary Priority: Should Have)*
- **REQ-09 (Selective / Friends-Only Spot Sharing):** The system should support sharing fishing spots selectively with trusted friends rather than sharing openly with all users. *(Rationale: P2's practice of sharing locations only with close companions; Preliminary Priority: Should Have)*

---

## 4. Traceability Matrix

The following matrix connects the participant-reported findings to preliminary system requirements using consistent requirement IDs and an initial MoSCoW prioritization.

| Requirement ID | Requirement Name | Source Findings | Addressed User Need / Problem | Preliminary Priority |
|---|---|---|---|---|
| **REQ-01** | **Private Fishing Spots** | P1 (Sec. 2.2.E), P2 (Sec. 3.2.D) | Anglers do not want to disclose productive locations publicly; prevents overcrowding and protects fish stocks. | **Must Have** |
| **REQ-02** | **Map-Based Spot Discovery and Navigation Details** | P1 (Sec. 2.2.A), P2 (Sec. 3.2.A) | Discovering locations, viewing spot coordinates, and inspecting water-body details (depth and terrain). | **Must Have** |
| **REQ-03** | **Integrated Weather and Barometric Forecasting** | P1 (Sec. 2.2.C), P2 (Sec. 3.2.C) | Both participants check weather before fishing; integrates atmospheric pressure and weather data directly into trip planning. | **Should Have** |
| **REQ-04** | **Catch Photos and History Logging** | P2 (Sec. 3.2.B) | Preserving catch memories through photographs without imposing complex manual data entry. | **Must Have** |
| **REQ-05** | **Local Regulations and Protected Species Awareness** | P1 (Sec. 2.2.D) | Facilitating adherence to regional fishing rules, seasonal spawning restrictions, and protected species lists. | **Should Have** |
| **REQ-06** | **Nearby Facilities and Infrastructure Points of Interest** | P1 (Sec. 2.2.F) | Identifying nearby amenities such as recreation bases, petrol stations, and tackle shops during fishing trips. | **Could Have** |
| **REQ-07** | **Emergency and Rescue Services Access** | P1 (Sec. 2.2.F) | Promoting angler safety in remote waters by providing access to local emergency and rescue contacts. | **Could Have** |
| **REQ-08** | **Personalized Lure and Technique Recommendations** | P2 (Sec. 3.2.E) | Helping anglers select suitable lure color, size, and retrieval technique based on personal inventory, weather, and pressure. | **Should Have** |
| **REQ-09** | **Selective / Friends-Only Spot Sharing** | P1 (Sec. 2.2.E), P2 (Sec. 3.2.D) | Enabling anglers to share productive spots selectively with close friends rather than sharing with the public. | **Should Have** |

---

## 5. Study Limitations

1. **Sample Size:** This exploratory study is based on two interviews ($N=2$). While the participants provide contrasting perspectives from an experienced lifelong angler and an intermediate angler, two interviews cannot represent the broad population of recreational anglers, varied age demographics, or different fishing disciplines.
2. **Geographical Specificity:** The regional examples mentioned by P1 (Ganyushkino, Kigach Fortuna) represent specific local waters. The findings cannot be generalized to all geographic regions, inland lakes, reservoirs, or marine environments, which may involve different biological, logistical, and legal contexts.
3. **Self-Reported Nature of Findings:** Findings rely on retrospective self-reporting by the participants. Statements regarding equipment effectiveness, fishing habits, and environmental factors reflect personal perceptions rather than independently verified biological or physical facts.
4. **Preliminary Status of Requirements:** Inferred requirements are preliminary candidate inputs. They serve as an initial qualitative baseline to be refined and evaluated in the formal requirements specification (`requirements-specification.md`) rather than finalized or validated requirements.
