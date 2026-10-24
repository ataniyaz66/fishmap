# Comparative Analysis of Existing Fishing Applications

**Author:** Mutigolla Ataniyaz  
**Task:** FIS-17 — Compare existing fishing applications  
**Project:** FishMap — Cross-Platform Social Network and Geospatial Platform for Anglers  
**Branch:** `FIS-17-compare-fishing-apps`  
**Review date:** October 2026

## 1. Introduction

Fishing applications help anglers find locations, save spots, record catches, check weather, and share experiences. However, applications differ in their main purpose. Some focus on maps and forecasts, while others provide social networking, fishing-location directories, or administrative services.

This review compares five applications listed on the Kazakhstan Apple App Store: FishMan, FishAngler, Fishing Points, Easy Fishing, and HFT. The comparison focuses on features relevant to FishMap and on how well each application documents support for anglers in Kazakhstan.

The review uses public product listings and official websites referenced below. It does not claim that every feature was tested directly inside each application. If a feature is not mentioned in the reviewed sources, it is marked **"Not documented"** rather than assumed to be absent.

## 2. Method

### 2.1 Applications reviewed

| Application | Main comparison role | Official listing |
|---|---|---|
| FishMan — Fishing Spots | Fishing spots, catch records, forecasts, and fishing advice | [Apple App Store](https://apps.apple.com/kz/app/fishman-fishing-spots/id6503952002) |
| FishAngler — Fish Finder App | Fishing community, catch logbook, and equipment catalog | [Apple App Store](https://apps.apple.com/kz/app/fishangler-fish-finder-app/id1073941118) |
| Fishing Points — Fish App | Waypoints, navigation, weather, and fishing forecasts | [Apple App Store](https://apps.apple.com/kz/app/fishing-points-fish-app/id1203032512) |
| Easy Fishing | Fishing locations and fishing bases in Kazakhstan | [Apple App Store](https://apps.apple.com/kz/app/easy-fishing/id1635927595) |
| HFT — Hunting, Fishing, Tourism | Outdoor navigation and regional hunting/fishing services | [Apple App Store](https://apps.apple.com/kz/app/hft-hunting-fishing-tourism/id1671158081) |

### 2.2 Evaluation criteria

Each application is considered against nine criteria:

1. Maps and saved fishing spots.
2. Catch logging, photographs, and statistics.
3. Social feed, friends, comments, and messaging.
4. Weather and fishing forecasts.
5. Lure and tackle inventory.
6. AI assistance and fish identification.
7. Privacy controls for spots and catches.
8. Fishing locations and services in Kazakhstan.
9. Local fish species, languages, and regional adaptation.

### 2.3 Evidence labels

- **Advertised:** The feature is described in a public product listing or official product source.
- **Partial:** A related capability is documented, but it does not clearly cover the full criterion.
- **Not documented:** The reviewed public sources do not provide enough information to confirm the feature.
- **Repository evidence:** The FishMap codebase contains relevant code or UI. This label does not by itself prove that the feature works end-to-end in a deployed application.

## 3. Comparison matrix

The matrix summarizes what is documented in the sources reviewed for this report. It should be read as a comparison of documented capabilities, not as the result of comprehensive hands-on testing.

| Criterion | FishMan | FishAngler | Fishing Points | Easy Fishing | HFT | FishMap repository |
|---|---|---|---|---|---|---|
| 1. Maps and saved spots | Advertised [1] | Advertised [3] | Advertised [5] | Advertised [7] | Advertised [8] | Map and spot-related code reported in repository |
| 2. Catch logging and statistics | Advertised [1] | Advertised [3] | Advertised [5] | Not documented [7] | Partial; scope may differ [8] | Catch model and journal UI reported in repository |
| 3. Social feed, friends, and chat | Some community features advertised [1] | Advertised [3] | Not documented as a social network [5] | Reviews/comments on locations advertised [7] | Not documented as an angler social network [8] | Feed, posts, comments, likes, and chat code reported |
| 4. Weather and forecasts | Advertised [1] | Advertised [3] | Advertised [5] | Not documented [7] | Partial; details need confirmation [8] | Weather service and UI code reported |
| 5. Tackle inventory | Standalone inventory not confirmed [1] | Advertised in product materials [3, 4] | Not documented [5] | Not documented [7] | Not documented [8] | Inventory models and UI code reported |
| 6. AI and fish identification | AI advice advertised [1] | AI features advertised [3] | FishMaps.AI described by developer [6] | Not documented [7] | AI assistant described by developer [9] | Text-based AI and rule-based fallback reported; photo identification planned |
| 7. Spot privacy controls | Details in official material need checking [1, 2] | Privacy features described [3, 4] | Private waypoints/logs described [5, 6] | Not documented [7] | Not documented in sufficient detail [8] | Visibility fields/UI reported; coordinate blurring planned |
| 8. Kazakhstan locations and services | Not documented in reviewed sources [1, 2] | Not documented in sufficient detail [3, 4] | Not documented in sufficient detail [5, 6] | Kazakhstan locations advertised [7] | Kazakhstan services advertised [8, 9] | Custom spots supported; curated directory remains planned |
| 9. Local species, languages, and context | Language/species coverage needs direct verification [1] | Language/species coverage needs direct verification [3, 4] | Language/species coverage needs direct verification [5, 6] | Regional focus documented; full language/species details need checking [7] | Kazakh/Russian support described [8] | Localization and a regional fish catalog reported in repository |

**Evidence caution:** Some cells intentionally use cautious wording because a product listing alone may not establish whether a capability is available in every region, in the free tier, or in the current app version. Confirm details against the current official source before treating them as definitive.

## 4. Application summaries

### 4.1 FishMan — Fishing Spots

**Sources:** [Kazakhstan App Store listing](https://apps.apple.com/kz/app/fishman-fishing-spots/id6503952002) [1] and [official website](https://fishman-app.com/) [2].

FishMan is presented as an application for finding fishing spots and using fishing-related tools. Its store listing describes maps and community fishing information, catch tracking, fishing forecasts, and AI-based advice.

**Relevance to FishMap:** FishMan overlaps with FishMap in location discovery, catch records, and fishing assistance. FishMap could differentiate itself through its planned combination of local fish information, multilingual interface, equipment inventory, and community tools tailored to Kazakhstan.

**Limitations of this review:** The public sources cited here are not enough to establish every detail of FishMan's private spot-sharing model, standalone tackle inventory, or Kazakhstan-specific regulatory coverage. These features should not be described as absent without further verification.

### 4.2 FishAngler — Fish Finder App

**Sources:** [Kazakhstan App Store listing](https://apps.apple.com/kz/app/fishangler-fish-finder-app/id1073941118) [3] and [official website](https://www.fishangler.com/) [4].

FishAngler presents itself as a fishing community as well as a fishing utility. Its public materials describe social features, catch logging, weather information, and equipment-related tools.

**Relevance to FishMap:** FishAngler is a close comparison for the social-network side of FishMap. FishMap should therefore focus its differentiation on practical regional usefulness rather than claiming that social feeds, catch logs, or tackle catalogs are unique features.

**Limitations of this review:** The sources listed here do not independently establish the completeness of FishAngler's species database, local equipment catalog, or fishing-regulation information for Kazakhstan. Those points require direct confirmation.

### 4.3 Fishing Points — Fish App

**Sources:** [Kazakhstan App Store listing](https://apps.apple.com/kz/app/fishing-points-fish-app/id1203032512) [5] and [official website](https://fishingpoints.app/) [6].

Fishing Points focuses on fishing-location tools, navigation, weather information, and forecasts. Its public materials also describe FishMaps.AI-related capabilities.

**Relevance to FishMap:** Fishing Points demonstrates the value of dependable maps, saved waypoints, and environmental information. FishMap can combine similar practical tools with a social community and a regionally focused fishing catalog.

**Limitations of this review:** The public materials reviewed for this report do not establish the full extent of Kazakhstan-specific content. The lack of a documented social feature in a listing should not be treated as proof that no related feature exists in every version.

### 4.4 Easy Fishing

**Source:** [Kazakhstan App Store listing](https://apps.apple.com/kz/app/easy-fishing/id1635927595) [7].

Easy Fishing is a regionally relevant comparator because its public listing describes fishing locations and fishing bases in Kazakhstan, including location-related information useful to anglers.

**Relevance to FishMap:** A local directory can help anglers discover where to fish. FishMap's opportunity is to combine local place information with catch journals, friends, posts, messaging, weather, and personal tackle management in one product.

**Limitations of this review:** The listing alone does not confirm every possible feature in the current application. Catch logging, forecasts, AI, and equipment management are marked as undocumented here unless a source explicitly supports them.

### 4.5 HFT — Hunting, Fishing, Tourism

**Sources:** [Kazakhstan App Store listing](https://apps.apple.com/kz/app/hft-hunting-fishing-tourism/id1671158081) [8] and [official website](https://hft.kz/) [9].

HFT is a Kazakhstan-focused outdoor platform. Its public materials describe services related to hunting, fishing, outdoor navigation, and regional information.

**Relevance to FishMap:** HFT highlights the importance of local geographic and regulatory context. FishMap could complement this type of regional information with a community-first experience and tools for recording catches and managing equipment.

**Limitations of this review:** This report does not independently test HFT's map data, permit workflows, emergency functions, or AI assistant. Such capabilities should be described only to the extent confirmed by the cited official sources.

## 5. FishMap repository status

This section distinguishes the project's reported code-level implementation from features that remain planned. A file, model, or screen in the repository is not by itself proof that a complete user workflow works in production. The statements below should be checked against the current branch before submission.

### 5.1 Capabilities reported in the repository

- **Map and fishing spots:** Flutter map-related screens and spot creation components, plus backend fishing-spot models.
- **Catch journal:** Catch model and journal/recording screens.
- **Community:** Social-service code and client screens for posts, comments, and likes.
- **Messaging:** Chat-service code and Flutter chat screens, including Socket.IO-related functionality.
- **Weather:** A weather service using Open-Meteo and related client UI.
- **Equipment inventory:** Inventory models, service code, and screens for viewing and adding gear.
- **Fishing advice:** An AI service with a Gemini integration and a rule-based fallback, plus an assistant screen.
- **Privacy controls:** Visibility-related model fields and a spot visibility control in the UI.
- **Localization and fish catalog:** Russian, Kazakh, and English localization files, and a regional fish catalog.

These are repository-level observations reported during development. They should be labelled "implemented in repository" until end-to-end tests confirm the corresponding user journeys.

### 5.2 Capabilities identified as planned or requiring more verification

- A curated, preloaded directory of fishing waters and fishing bases across Kazakhstan.
- Automatic blurring or obfuscation of public fishing-spot coordinates.
- Image-based fish species identification.
- Offline map tile packages.
- A maintained database of regional fishing rules, seasonal restrictions, and official fishing-area boundaries.
- End-to-end verification of social, inventory, weather, and AI workflows in a running environment.

## 6. Discussion: Why FishMap may be useful

The five applications serve different needs. FishMan and FishAngler provide examples of fishing tools combined with community or AI-oriented features. Fishing Points emphasizes navigation and forecast-related tools. Easy Fishing and HFT are relevant regional comparisons because their public materials focus on Kazakhstan locations or outdoor services.

The comparison suggests a potential product opportunity: **FishMap can bring several everyday fishing workflows together while prioritizing Kazakhstan's local context.** This is a product hypothesis supported by the differences in focus across the reviewed applications; it is not proof that no competitor offers any individual feature.

FishMap's intended value can be summarized in four points:

1. **A shared fishing community:** Posts, comments, catch records, and messaging designed around anglers.
2. **Local adaptation:** Kazakh, Russian, and English interface support, plus a fish catalog relevant to Kazakhstan.
3. **Practical fishing tools:** Saved spots, catch journals, weather information, and personal equipment inventory.
4. **Privacy-aware sharing:** Users should be able to control who can see their fishing spots. Coordinate obfuscation must not be claimed as complete until implemented and tested.

For the product to deliver this value, the team should validate the most important workflows with anglers in Kazakhstan, verify the fish catalog and legal information against reliable local sources, and test privacy controls before promoting them as security features.

## 7. Limitations

1. **Public-source limitation:** This comparison is based on public store listings and official websites, not a systematic test of every app version.
2. **Feature availability:** Some features may depend on region, subscription, account status, or app version.
3. **Undocumented does not mean absent:** A feature omitted from a public listing may still exist in the application.
4. **FishMap implementation status:** Repository code does not guarantee that a feature is deployed, stable, or connected end-to-end.
5. **Regional coverage:** Kazakhstan-specific species, waterbody, and regulatory coverage requires separate verification using authoritative local sources.
6. **Date sensitivity:** App listings and capabilities change. Recheck all sources immediately before the final academic submission.

## 8. References

1. Apple. *FishMan — Fishing Spots*. Kazakhstan App Store listing. https://apps.apple.com/kz/app/fishman-fishing-spots/id6503952002
2. FishMan. Official website. https://fishman-app.com/
3. Apple. *FishAngler — Fish Finder App*. Kazakhstan App Store listing. https://apps.apple.com/kz/app/fishangler-fish-finder-app/id1073941118
4. FishAngler. Official website. https://www.fishangler.com/
5. Apple. *Fishing Points — Fish App*. Kazakhstan App Store listing. https://apps.apple.com/kz/app/fishing-points-fish-app/id1203032512
6. Fishing Points. Official website. https://fishingpoints.app/
7. Apple. *Easy Fishing*. Kazakhstan App Store listing. https://apps.apple.com/kz/app/easy-fishing/id1635927595
8. Apple. *HFT — Hunting, Fishing, Tourism*. Kazakhstan App Store listing. https://apps.apple.com/kz/app/hft-hunting-fishing-tourism/id1671158081
9. HFT. Official website. https://hft.kz/

**Final verification note:** Confirm each detailed feature claim against the current source before submission. Where an official source does not clearly support a claim, keep the cautious wording used in this report rather than presenting the claim as verified.
