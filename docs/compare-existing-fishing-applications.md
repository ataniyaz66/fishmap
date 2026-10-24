# Comparative Analysis of Existing Fishing Applications

**Author:** Mutigolla Ataniyaz<br>
**Task:** FIS-17: Compare existing fishing applications<br>
**Project:** FishMap вЂ” Cross-Platform Social Network and Geospatial Platform for Anglers<br>
**Repository Branch:** `FIS-17-compare-fishing-apps`<br>
**Date of Audit:** October 2026

---

## 1. Introduction and Objectives

Recreational angling relies on a combination of environmental monitoring, geospatial navigation, equipment management, and historical catch telemetry. In mobile software, fishing applications have expanded from basic waypoint markers into platforms that combine machine learning, crowdsourced catch maps, and social networking feeds.

However, the current market presents a noticeable divergence between international applications and regional outdoor software in Kazakhstan. Leading global platforms often prioritize North American and Western European fisheries, commonly omitting Central Asian river basins, endemic fish species, and regional regulatory frameworks from primary navigation and promotional listings. Conversely, existing Kazakhstan-specific applications typically function as commercial directories or regulatory permit stores, without full-featured angler social networking, tackle box inventory tracking, or automated meteorological bite predictions.

The objective of this study is to conduct an audited comparative evaluation of five real commercial mobile fishing applications available on the Apple App Store (Kazakhstan storefront):
1. **FishMan вЂ” Fishing Spots** (FishMan LLC)
2. **FishAngler вЂ” Fish Finder App** (FishAngler LLC)
3. **Fishing Points вЂ” Fish App** (Fishing Points d.o.o.)
4. **Easy Fishing** (Easy Fishing)
5. **HFT вЂ” Hunting, Fishing, Tourism** (HFT LIMITED)

This document evaluates these applications across nine functional and regional criteria against verified official product listings, developer help documentation, and privacy disclosures. In addition, it audits the current implementation status of the **FishMap** codebase to distinguish implemented capabilities from planned features, establishing an evidence-based foundation for FishMap's development roadmap.

---

## 2. Methodology and Verification Standards

### 2.1 Evaluated Applications
The five applications were chosen to represent both globally recognized multi-feature platforms and established regional outdoor applications in Kazakhstan:
- **Global Applications:**
  - *FishMan* ([Apple App Store KZ ID: 6503952002](https://apps.apple.com/kz/app/fishman-fishing-spots/id6503952002))
  - *FishAngler* ([Apple App Store KZ ID: 1073941118](https://apps.apple.com/kz/app/fishangler-fish-finder-app/id1073941118))
  - *Fishing Points* ([Apple App Store KZ ID: 1203032512](https://apps.apple.com/kz/app/fishing-points-fish-app/id1203032512))
- **Kazakhstan Regional Applications:**
  - *Easy Fishing* ([Apple App Store KZ ID: 1635927595](https://apps.apple.com/kz/app/easy-fishing/id1635927595))
  - *HFT: Hunting, Fishing, Tourism* ([Apple App Store KZ ID: 1671158081](https://apps.apple.com/kz/app/hft-hunting-fishing-tourism/id1671158081))

### 2.2 Comparison Criteria
Each application is evaluated against nine criteria:
1. **Fishing Maps and Saved Spots:** Interactive map view, custom spot creation, navigation, depth contours, and offline support.
2. **Catch Logging, Photos, and Statistics:** Digital catch logbook recording species, size, weight, bait, photos, and historical trends.
3. **Friends, Social Feed, Comments, and Messaging:** Social networking features including chronological/algorithmic activity feed, comments, likes, follower networks, and user-to-user chat.
4. **Weather and Fishing Forecasts:** Atmospheric pressure, wind, temperature, solunar feeding tables, and dynamic bite activity ratings.
5. **Lure/Tackle Inventory:** Dedicated equipment management (rods, reels, lures, lines) and association of specific gear with catches.
6. **AI Features and Fish Identification:** Artificial intelligence capabilities, including image-based fish species identification and conversational fishing advice.
7. **Privacy Controls for Fishing Spots:** Privacy settings for waypoints and catches (e.g., private spots, friends-only sharing, coordinate protection).
8. **Kazakhstan and Local Fishing Locations:** Documented support for Kazakhstan waterways (e.g., Balkhash, Kigach, Kapchagay, Ural-Caspian basin) and regional fishing bases.
9. **Local Fish Species, Languages, and Regional Adaptation:** Native support for regional fish species, local fishing regulations, and user interface languages (Kazakh, Russian, English).

### 2.3 Evidence Rating Scale and Audit Rules
To maintain factual rigor:
- **"Yes (Advertised)"**: The feature is explicitly described in official store listings, developer documentation, or product manuals.
- **"Partial"**: The feature exists in a limited capacity (e.g., free-text notes rather than a structured catalog, or global map tiles without local administrative data).
- **"Not documented in reviewed sources"**: The feature is not mentioned in official App Store descriptions, developer websites, or help centers. This classification avoids unsupported negative assertions.
- **"No (Out of scope / Absent by design)"**: The platform's official documentation defines a scope that explicitly excludes this capability (e.g., a pure utility tool stating it does not offer social networking).
- **FishMap Repository Verification**: FishMap's capabilities are classified as **"Implemented in repository"** (verified in active source code and user interface) or **"Partial / In development"** (backend schema or partial UI present, or planned in architecture).

---

## 3. Comparative Evaluation Matrix

| Feature / Criterion | FishMan | FishAngler | Fishing Points | Easy Fishing | HFT | FishMap (Repository Status) |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **1. Fishing Maps and Saved Spots** | **Yes (Advertised)**<br>([Ref. 1](#ref-1)) | **Yes (Advertised)**<br>([Ref. 3](#ref-3)) | **Yes (Advertised)**<br>([Ref. 5](#ref-5)) | **Yes (Advertised)**<br>([Ref. 7](#ref-7)) | **Yes (Advertised)**<br>([Ref. 8](#ref-8)) | **Implemented in repository**<br>(Interactive OSM map, custom spot dialog, PostGIS coordinates) |
| **2. Catch Logging & Statistics** | **Yes (Advertised)**<br>([Ref. 1](#ref-1)) | **Yes (Advertised)**<br>([Ref. 3](#ref-3)) | **Yes (Advertised)**<br>([Ref. 5](#ref-5)) | **Not documented**<br>([Ref. 7](#ref-7)) | **Partial**<br>([Ref. 8](#ref-8)) | **Implemented in repository**<br>(Catch recording UI, journal screen, backend catch model) |
| **3. Social Feed, Friends & Chat** | **Partial**<br>([Ref. 1](#ref-1)) | **Yes (Advertised)**<br>([Ref. 3](#ref-3)) | **No (Out of scope)**<br>([Ref. 5](#ref-5)) | **Partial**<br>([Ref. 7](#ref-7)) | **No (Out of scope)**<br>([Ref. 8](#ref-8)) | **Implemented in repository**<br>(Feed screen, post creation, comments, likes, Socket.IO chat) |
| **4. Weather & Fishing Forecasts** | **Yes (Advertised)**<br>([Ref. 1](#ref-1)) | **Yes (Advertised)**<br>([Ref. 3](#ref-3)) | **Yes (Advertised)**<br>([Ref. 5](#ref-5)) | **Not documented**<br>([Ref. 7](#ref-7)) | **Partial**<br>([Ref. 8](#ref-8)) | **Implemented in repository**<br>(Open-Meteo weather service, barometer advice, bite rating UI) |
| **5. Lure / Tackle Inventory** | **Partial**<br>([Ref. 1](#ref-1)) | **Yes (Advertised)**<br>([Ref. 4](#ref-4)) | **Partial**<br>([Ref. 5](#ref-5)) | **Not documented**<br>([Ref. 7](#ref-7)) | **No (Out of scope)**<br>([Ref. 8](#ref-8)) | **Implemented in repository**<br>(Personal inventory screen, add-item dialog, backend inventory service) |
| **6. AI Features & Fish ID** | **Yes (Advertised)**<br>([Ref. 1](#ref-1)) | **Yes (Advertised)**<br>([Ref. 3](#ref-3)) | **Partial**<br>([Ref. 6](#ref-6)) | **Not documented**<br>([Ref. 7](#ref-7)) | **Yes (Advertised)**<br>([Ref. 9](#ref-9)) | **Implemented (LLM & Rules) / Planned (Vision)**<br>(Conversational advice via gemini-1.5-flash + rules; photo ID planned) |
| **7. Privacy Controls for Spots** | **Yes (Advertised)**<br>([Ref. 2](#ref-2)) | **Yes (Advertised)**<br>([Ref. 3](#ref-3)) | **Yes (Advertised)**<br>([Ref. 5](#ref-5)) | **Not documented**<br>([Ref. 7](#ref-7)) | **Partial**<br>([Ref. 8](#ref-8)) | **Implemented (Toggles & DB) / Planned (Blurring)**<br>(Public/private UI toggle, DB 3-tier enum; coordinate blurring planned) |
| **8. Kazakhstan Fishing Locations** | **Not documented**<br>([Ref. 1](#ref-1)) | **Partial**<br>([Ref. 3](#ref-3)) | **Partial**<br>([Ref. 5](#ref-5)) | **Yes (Advertised)**<br>([Ref. 7](#ref-7)) | **Yes (Advertised)**<br>([Ref. 8](#ref-8)) | **Partial / In development**<br>(Map centered on Astana with custom spot marking; curated national directory planned) |
| **9. Local Species, Languages & Context** | **Partial**<br>([Ref. 1](#ref-1)) | **Partial**<br>([Ref. 3](#ref-3)) | **Partial**<br>([Ref. 5](#ref-5)) | **Partial**<br>([Ref. 7](#ref-7)) | **Yes (Advertised)**<br>([Ref. 8](#ref-8)) | **Implemented in repository**<br>(Trilingual ru/kk/en UI; 12-species regional fish catalog with legal size limits) |

---

## 4. Detailed Application Reviews

### 4.1 FishMan вЂ” Fishing Spots
- **Publisher / Developer:** FishMan LLC ([Ref. 1](#ref-1))
- **Store Listing:** [Apple App Store (Kazakhstan storefront, ID: 6503952002)](https://apps.apple.com/kz/app/fishman-fishing-spots/id6503952002) ([Ref. 1](#ref-1))
- **Official Website:** <https://fishman-app.com/> ([Ref. 2](#ref-2))

#### Verified Features (Based on Official Store Description):
- **Interactive Maps & Spots:** Advertises global fishing map tiles, community-submitted spots, difficulty ratings, and local catch photos ([Ref. 1](#ref-1)).
- **Dynamic Fishing Forecasts:** Advertises a dynamic "Fish Score" (0вЂ“100) calculated from real-time barometric pressure, wind speed/direction, water temperature, and solunar cycles ([Ref. 1](#ref-1)).
- **AI Fishing Coach:** Advertises an integrated AI conversational coach offering personalized lure recommendations and tactical advice based on real-time weather and GPS data ([Ref. 1](#ref-1)).
- **Catch Logbook:** Includes a "Fish Tracker" to log catches with photo attachments, weight, length, bait type, and automated weather stamps ([Ref. 1](#ref-1)).
- **Live Battles:** Allows anglers to create friendly fishing tournaments with friends using invite codes and real-time leaderboards ([Ref. 1](#ref-1)).
- **Language Support:** The App Store listing specifies support for 37 languages, including English, Russian, German, French, and Spanish; the Kazakh language is not listed ([Ref. 1](#ref-1)).

#### Documented Constraints and Regional Limitations:
- **Tackle Inventory:** Bait can be recorded as an attribute of an individual catch log, but official documentation does not advertise a standalone virtual tackle box for managing owned rods, reels, or terminal tackle ([Ref. 1](#ref-1)).
- **Social Capabilities:** Advertises group tournament battles and public community photos, but does not document user profile friendship graphs or private direct messaging in reviewed listings ([Ref. 1](#ref-1)).
- **Kazakhstan Regional Coverage:** Not documented in reviewed sources. While global mapping allows users to drop pins anywhere in the world, the store description and official site do not document curated regional waterbodies, fishing leaseholder contacts, or regulatory spawning rules for Kazakhstan ([Ref. 1](#ref-1), [Ref. 2](#ref-2)).

---

### 4.2 FishAngler вЂ” Fish Finder App
- **Publisher / Developer:** FishAngler LLC ([Ref. 3](#ref-3))
- **Store Listing:** [Apple App Store (Kazakhstan storefront, ID: 1073941118)](https://apps.apple.com/kz/app/fishangler-fish-finder-app/id1073941118) ([Ref. 3](#ref-3))
- **Official Website:** <https://www.fishangler.com/> ([Ref. 4](#ref-4))

#### Verified Features (Based on Official Store Description & Help Center):
- **Full Social Network:** Advertises a comprehensive community platform including an activity news feed, user profiles, public/private groups organized by species or fishing method, comments, likes, and direct user-to-user messaging ([Ref. 3](#ref-3)).
- **Virtual Tackle Box ("My Gear"):** Features a dedicated digital gear locker where anglers can catalog rods, reels, lines, and lures from a commercial database of over 100,000 items and associate them with logged catches ([Ref. 4](#ref-4)).
- **FINNв„ў AI & Fish Identification:** Advertises instant fish species recognition from photos using computer vision, alongside AI-generated trip advice ([Ref. 3](#ref-3)).
- **Logbook with Granular Privacy:** Records over 45 catch attributes. Official documentation states that exact GPS catch coordinates and waypoints can be kept private by default, allowing users to share catches publicly while concealing secret spots ([Ref. 3](#ref-3), [Ref. 4](#ref-4)).
- **Weather & Marine Telemetry:** Provides 7-day hourly weather, wind, barometric pressure history, water temperature, tide forecasts, and solunar peak feeding times ([Ref. 3](#ref-3)).

#### Documented Constraints and Regional Limitations:
- **Language Support:** Supports Russian, English, and approximately 25 other languages in App Store metadata; the Kazakh language is not listed as supported ([Ref. 3](#ref-3)).
- **Gear Catalog Focus:** The gear database emphasizes major Western and Japanese tackle manufacturers ([Ref. 4](#ref-4)); local Central Asian terminal tackle is not documented in reviewed materials.
- **Regional Regulatory Content:** Not documented in reviewed sources. The application maps bodies of water globally, but reviewed materials do not document localized Kazakhstan fishing regulations, seasonal spawning bans, or leaseholder tenancy boundaries ([Ref. 3](#ref-3)).

---

### 4.3 Fishing Points вЂ” Fish App
- **Publisher / Developer:** Fishing Points d.o.o. (Slovenia) ([Ref. 5](#ref-5))
- **Store Listing:** [Apple App Store (Kazakhstan storefront, ID: 1203032512)](https://apps.apple.com/kz/app/fishing-points-fish-app/id1203032512) ([Ref. 5](#ref-5))
- **Official Website:** <https://fishingpoints.app/> ([Ref. 6](#ref-6))

#### Verified Features (Based on Official Store Description & Privacy Policy):
- **GPS Navigation & Marine Charts:** Advertises custom waypoint saving, boat ramp markers, trolling path recording, NOAA vector nautical charts, and offline map caching ([Ref. 5](#ref-5)).
- **Solunar & Atmospheric Telemetry:** Comprehensive solunar calendar, major/minor feeding periods, hourly barometric pressure graph, wind radar, tide predictions, sea surface temperature (SST), and wave swell data ([Ref. 5](#ref-5)).
- **Catch Logbook:** Digital logbook storing photos, fish weight, length, bait used, and automated timestamps of atmospheric conditions ([Ref. 5](#ref-5)).
- **FishMaps.AI:** Incorporates specialized algorithms to analyze lake bathymetry, structure, and breaklines to predict fish-holding areas ([Ref. 6](#ref-6)).
- **Data Privacy:** Official documentation confirms that saved GPS waypoints and catch logs remain strictly private and accessible only to the account owner ([Ref. 5](#ref-5), [Ref. 6](#ref-6)).

#### Documented Constraints and Regional Limitations:
- **Social Networking (Out of scope by product design):** Fishing Points is designed strictly as a personal utility tool. The official listing confirms it does not contain a public community feed, follower system, comments, or user-to-user messaging ([Ref. 5](#ref-5)).
- **Tackle Inventory:** A dedicated standalone tackle box management system is not documented in reviewed sources; bait information is entered as free text within catch entries ([Ref. 5](#ref-5)).
- **Language & Regional Context:** Supports Russian, English, and other European languages in App Store metadata; Kazakh is not listed as supported ([Ref. 5](#ref-5)). Detailed bathymetric contours focus primarily on coastal ocean areas and major North American lakes.

---

### 4.4 Easy Fishing
- **Publisher / Developer:** Easy Fishing ([Ref. 7](#ref-7))
- **Store Listing:** [Apple App Store (Kazakhstan storefront, ID: 1635927595)](https://apps.apple.com/kz/app/easy-fishing/id1635927595) ([Ref. 7](#ref-7))

#### Verified Features (Based on Official Store Description):
- **Kazakhstan Waterbody Directory:** Advertises dedicated mapping of lakes, rivers, and managed fishing bases (*СЂС‹Р±РѕР»РѕРІРЅС‹Рµ Р±Р°Р·С‹*) across Kazakhstan, with initial focus on the Almaty, Kapchagay, and Balkhash regions ([Ref. 7](#ref-7)).
- **Leaseholder & Pricing Data:** Documents permit and ticket costs (*РїСѓС‚С‘РІРєРё*), base administrator contacts, driving directions, and fish species known to inhabit each waterbody ([Ref. 7](#ref-7)).
- **Search & Bookmarks:** Allows users to filter waterbodies by target fish species and save venues to a personal "Favorites" list ([Ref. 7](#ref-7)).
- **User Reviews:** Users can view and post comments and reviews on specific fishing spots ([Ref. 7](#ref-7)).

#### Documented Constraints and Regional Limitations:
- **Personal Catch Logging:** Not documented in reviewed sources. The official store description does not document personal catch tracking, telemetry logs, or catch photo albums ([Ref. 7](#ref-7)).
- **Forecasts & Telemetry:** Not documented in reviewed sources. Dynamic meteorological forecasts, barometric graphs, and solunar ratings are not documented in the reviewed listing ([Ref. 7](#ref-7)).
- **AI & Equipment Management:** Not documented in reviewed sources. Computer vision fish identification, conversational AI, and tackle box inventories are not documented ([Ref. 7](#ref-7)).
- **Language Support:** Available in Russian; native Kazakh interface localization is not documented in the reviewed store listing ([Ref. 7](#ref-7)).

---

### 4.5 HFT: Hunting, Fishing, Tourism
- **Publisher / Developer:** HFT LIMITED ([Ref. 8](#ref-8))
- **Store Listing:** [Apple App Store (Kazakhstan storefront, ID: 1671158081)](https://apps.apple.com/kz/app/hft-hunting-fishing-tourism/id1671158081) ([Ref. 8](#ref-8))
- **Official Website:** <https://hft.kz/> ([Ref. 9](#ref-9))

#### Verified Features (Based on Official Store Description & Platform Documentation):
- **Official Farm Boundaries:** Displays verified territorial boundaries of hunting and fishing farms across all administrative regions of Kazakhstan on an interactive map ([Ref. 8](#ref-8)).
- **Electronic Permits:** Directly integrates with regional wildlife authorities and the "Qansonar" association for purchasing, verifying, and tracking hunting and fishing permits online ([Ref. 8](#ref-8), [Ref. 9](#ref-9)).
- **GPS Navigation & Tracks:** Supports waypoint saving, route tracking, and GPX file import/export for offline outdoor navigation ([Ref. 8](#ref-8)).
- **"Arlan" AI Assistant:** Features a conversational assistant ("Arlan") capable of answering user queries regarding hunting/fishing seasons, regional legal rules, and travel routes ([Ref. 9](#ref-9)).
- **SOS Emergency Service:** Integrates an emergency coordinate broadcast feature for outdoor safety in remote regions ([Ref. 9](#ref-9)).
- **Bilingual Interface:** Fully supports both Kazakh and Russian languages in official App Store metadata ([Ref. 8](#ref-8)).

#### Documented Constraints and Regional Limitations:
- **Angler Social Networking (Out of scope by product design):** HFT is structured as an administrative, commercial, and tourism platform. It does not feature an open user social feed, friend activity stream, post comments, or social messaging ([Ref. 8](#ref-8)).
- **Tackle Inventory:** Out of scope by product design. Does not include fishing equipment or lure tracking modules ([Ref. 8](#ref-8)).
- **Catch Telemetry:** Catch recording is structured around formal statutory trophy declarations associated with permits; it does not offer an angler-centric logbook with meteorological conditions and lure analytics ([Ref. 8](#ref-8)).

---

## 5. FishMap Implementation Status Audit

To ensure transparency, FishMap's capabilities were audited directly against the active repository source code and branches:

```
в”Њв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”ђ
в”‚                         FISHMAP CODEBASE AUDIT                              в”‚
в”њв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”¬в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”¤
в”‚ IMPLEMENTED IN REPOSITORY              в”‚ PLANNED / IN DEVELOPMENT           в”‚
в”њв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”јв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”¤
в”‚ вЂў Interactive Flutter Map (OSM/Carto)  в”‚ вЂў Pre-packaged offline tile packs  в”‚
в”‚ вЂў Custom Spot Creation & Coordinates   в”‚ вЂў Bathymetric depth contours       в”‚
в”‚ вЂў Catch Model & Journal Screens        в”‚ вЂў Advanced telemetry charts        в”‚
в”‚ вЂў Social Feed, Posts, Comments, Likes  в”‚ вЂў Computer vision fish photo ID    в”‚
в”‚ вЂў Real-time Chat (Socket.IO & Express) в”‚ вЂў Automatic coordinate blurring    в”‚
в”‚ вЂў Open-Meteo Weather Service & UI      в”‚ вЂў Spawning ban calendar integrationв”‚
в”‚ вЂў Personal Inventory Screen & Models   в”‚ вЂў Full national leaseholder DB     в”‚
в”‚ вЂў Spot Visibility (UI toggle & DB enum)в”‚ вЂў Curated waterbody directory seedsв”‚
в”‚ вЂў Kazakh/Russian/English Localization  в”‚                                    в”‚
в”‚ вЂў 12-Species Kazakhstan Fish Catalog   в”‚                                    в”‚
в””в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”ґв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”
```

### 5.1 Verified Implemented Features
1. **Geospatial Spot Mapping:** Implemented in `frontend/flutter_app/lib/features/map/` (`map_screen.dart`, `create_spot_dialog.dart`, `spot_details_sheet.dart`) and `backend/services/fishing/` (`fishing-spot.model.js`). The map view defaults to Astana (`LatLng(51.1694, 71.4491)`), allowing anglers to drop custom pins with latitude/longitude coordinates, select water types, toggle spot visibility, and view spot details.
2. **Catch Logging & Journal:** The `Catch` model (`backend/services/fishing/src/models/catch.model.js`) stores species, weight, length, bait, notes, photo URLs, and timestamps. Catch entry and journal review UI are implemented in `frontend/flutter_app/lib/features/journal/screens/record_catch_screen.dart` and `journal_screen.dart`.
3. **Social Community & Messaging:** The Social service (`backend/services/social/`) implements posts, comments with threaded replies, comment likes, and image uploads. The Chat service (`backend/services/chat/`) provides conversation management, messaging, and real-time Socket.IO event delivery. The Flutter client includes feed screens (`feed_screen.dart`, `create_post_screen.dart`), comment sheets (`post_comments_sheet.dart`), and chat views (`conversations_screen.dart`, `chat_detail_screen.dart`).
4. **Meteorological Telemetry:** The Weather service (`backend/services/weather/`) fetches real-time temperature, wind speed/direction, and surface pressure from the Open-Meteo API. The Flutter client (`frontend/flutter_app/lib/features/weather/screens/weather_screen.dart`) renders condition cards, barometric trend advice, 7-day forecasts, and an outdoor suitability rating.
5. **Personal Tackle Inventory:** The Inventory service (`backend/services/inventory/`) provides dedicated schemas for user rods, reels, lines, and lures (`tackle-item.model.js`). The Flutter client implements `inventory_screen.dart` and `add_inventory_item_dialog.dart` (`frontend/flutter_app/lib/features/inventory/screens/`), allowing anglers to catalog personal gear items.
6. **Hybrid AI Architecture:** The AI service (`backend/services/ai/`) implements a dual-engine architecture:
   - Primary provider: Google Gemini API integration configured for `gemini-1.5-flash` (`backend/services/ai/src/providers/gemini.provider.js`) using the Google Generative Language v1beta endpoint.
   - Fallback provider: Deterministic, rule-based provider (`rule-based.provider.js`) for tactical lure and weather advice when an API key is not supplied or during network timeouts.
   - Flutter UI: `ai_assistant_screen.dart` provides conversational fishing assistance and gear recommendations.
7. **Spot Privacy Controls:**
   - Database schema: The `FishingSpot` and `Catch` models enforce a three-tier visibility enum: `'public'`, `'friends'`, and `'private'`.
   - Client UI: `create_spot_dialog.dart` exposes an `isPublic` switch allowing users to mark spots as public or private.
8. **Regional Localization & Fish Catalog:**
   - Multi-language localization (`frontend/flutter_app/lib/core/localization/app_localizations.dart`) provides complete UI translations for **Russian (`ru`)**, **Kazakh (`kk`)**, and **English (`en`)**.
   - A 12-species regional fish catalog (`frontend/flutter_app/lib/features/fishing/data/fish_catalog.dart`) covers indigenous and popular sportfish of Kazakhstan (common carp, northern pike, zander, crucian carp, European perch, wels catfish, common bream, Caspian roach/vobla, asp, trout, burbot, silver carp) with trilingual nomenclature, minimum legal harvest sizes, and regional waterbody descriptions.

### 5.2 Planned Capabilities (Explicitly Distinguished from Implemented Code)
- **Curated Waterbody & Base Directory Seeds:** While the map centers on Astana and allows dropping custom pins across Kazakhstan, pre-seeded regional directories of specific waterbodies (e.g., Balkhash, Kapchagay, Ili delta) and commercial base contacts are not pre-loaded into the database.
- **Automatic Coordinate Blurring:** While database models define visibility tiers and the UI has a public/private toggle, automated coordinate fuzzing or obfuscation on public social feed posts is not yet implemented.
- **Computer Vision Species Recognition:** Researched in Part 1 of the literature review (`docs/literature-review-client-ai.md`), but image-based classification models are not yet deployed in the application.
- **Offline Vector Tile Caching:** The mobile client currently requests map tiles over active network connections and does not bundle pre-packaged offline vector packs.
- **Administrative Regulatory Database:** Official hunting/fishing leaseholder tenancy boundaries and electronic permit purchasing (such as HFT's Qansonar integration) are planned integrations, not currently present in FishMap.

---

## 6. Synthesis: The Evidence-Based Opportunity for FishMap

The audited comparison reveals distinct market positioning among existing solutions:

1. **The Global Platform Divide:**
   Applications with mature social feeds and tackle management (*FishAngler*, *FishMan*) prioritize North American and Western European markets. In reviewed store descriptions and developer documentation, these platforms do not document native Kazakh language interfaces, Central Asian endemic fish species profiles, or localized Kazakhstan fishing regulations.

2. **The Regional Platform Divide:**
   Applications dedicated to Kazakhstan (*Easy Fishing*, *HFT*) provide valuable localized institutional data (fishing base contacts, legal farm boundaries, electronic permit sales). However, reviewed documentation indicates they are structured as informational directories or administrative portals rather than daily peer-to-peer angler social networks with integrated tackle box lockers and dynamic meteorological bite forecasts.

3. **FishMap Value Proposition:**
   FishMap addresses this gap by combining the interactive community and inventory capabilities of modern social applications with native localization for Kazakhstan:
   - **Community Social Core:** Provides an open activity feed, catch logs, and real-time chat tailored for anglers.
   - **Regional Adaptation:** Native Kazakh, Russian, and English interface support paired with an indigenous 12-species fish catalog citing regional waterbodies and legal size limits.
   - **Personal Gear Management:** Dedicated tackle locker screens allowing anglers to catalog rods, reels, lines, and lures.
   - **Balanced Privacy:** Allows anglers to catalog private spots and unlisted catches while choosing what to share with the community.
   - **Contextual Intelligence:** Combines meteorological telemetry with rule-based and LLM advice (`gemini-1.5-flash`) for regional waterways.

---

## 7. Limitations and Uncertainties

1. **Storefront Dynamic Updates:** Mobile applications receive frequent updates. This audit reflects official listings and documentation accessible on October 24, 2026. Features added in subsequent releases may alter specific ratings.
2. **Absence of Empirical Field Testing:** Evaluations of competitor applications are based on published App Store descriptions, developer help portals, and privacy disclosures. Unadvertised features or internal beta capabilities could not be verified without direct binary testing.
3. **Freemium Feature Gating:** Several evaluated applications (*FishMan*, *Fishing Points*, *HFT*) gate advanced capabilities (e.g., depth contours, offline maps, extended forecasts) behind paid subscriptions. Comparisons reflect advertised capabilities across both free and premium tiers.
4. **Distinction Between Architecture and Production Deployment:** For FishMap, this review audits features verified in repository source code and tests. Features marked as "Planned" represent documented engineering goals rather than delivered user experiences.
5. **Unresolved Evidence Gaps:**
   - Competitor internal species databases (e.g., whether non-advertised Central Asian fish species exist in global platforms' search indexes) could not be verified without decompiling proprietary application binaries or accessing active accounts.
   - Private group spot-sharing behavior for *FishMan* could not be conclusively determined from public App Store text alone.
   - Exact meteorological telemetry update frequencies for *FishMan* and *FishAngler* within Kazakhstan territory are not specified in public documentation.

---

## 8. References

<a id="ref-1"></a>
1. **Apple Inc. (2026).** *FishMan - Fishing Spots* [Mobile application]. Apple App Store (Kazakhstan storefront, ID: 6503952002). Retrieved October 24, 2026, from <https://apps.apple.com/kz/app/fishman-fishing-spots/id6503952002>
<a id="ref-2"></a>
2. **FishMan LLC. (2026).** *FishMan Official Website & Product Disclosures*. Retrieved October 24, 2026, from <https://fishman-app.com/>
<a id="ref-3"></a>
3. **Apple Inc. (2026).** *FishAngler: Fish Finder App* [Mobile application]. Apple App Store (Kazakhstan storefront, ID: 1073941118). Retrieved October 24, 2026, from <https://apps.apple.com/kz/app/fishangler-fish-finder-app/id1073941118>
<a id="ref-4"></a>
4. **FishAngler LLC. (2026).** *FishAngler Help Center: Logbook, My Gear, and Tackle Features*. Retrieved October 24, 2026, from <https://www.fishangler.com/>
<a id="ref-5"></a>
5. **Apple Inc. (2026).** *Fishing Points: Fish App* [Mobile application]. Apple App Store (Kazakhstan storefront, ID: 1203032512). Retrieved October 24, 2026, from <https://apps.apple.com/kz/app/fishing-points-fish-app/id1203032512>
<a id="ref-6"></a>
6. **Fishing Points d.o.o. (2026).** *FishMaps.AI: Structure and Lake Breakline Analysis*. Retrieved October 24, 2026, from <https://fishingpoints.app/>
<a id="ref-7"></a>
7. **Apple Inc. (2026).** *Easy Fishing* [Mobile application]. Apple App Store (Kazakhstan storefront, ID: 1635927595). Retrieved October 24, 2026, from <https://apps.apple.com/kz/app/easy-fishing/id1635927595>
<a id="ref-8"></a>
8. **Apple Inc. (2026).** *HFT: hunting, fishing, tourism* [Mobile application]. Apple App Store (Kazakhstan storefront, ID: 1671158081). Retrieved October 24, 2026, from <https://apps.apple.com/kz/app/hft-hunting-fishing-tourism/id1671158081>
<a id="ref-9"></a>
9. **HFT LIMITED. (2026).** *HFT Digital Platform: Hunting, Fishing, and Tourism in Kazakhstan*. Retrieved October 24, 2026, from <https://hft.kz/>
