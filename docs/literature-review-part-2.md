# Literature Review, Part 2: Backend Architecture, Geospatial Data, and Social Platforms

**Author:** Rustam Ataniyazov  
**Task:** FIS-16  
**Project:** FishMap — Cross-Platform Social Network for Anglers  
**Scope of this part:** Server-side microservice architecture, API evolution and coupling, geospatial data storage, spatial indexing and queries, and online social network privacy, security, and access control. (Computer vision for fish species identification and recommender systems are reviewed in Part 1 by the co-author in `docs/literature-review-client-ai.md`).

---

## 1. Introduction and Purpose

The primary objective of FishMap is to provide recreational anglers in Kazakhstan and internationally with an integrated platform that combines social interactions (posts, photo sharing, comments, friendships), interactive maps with fishing spots and waterbody telemetry, tackle inventory management, and intelligent fishing advice.

While Part 1 of the literature review established the scientific foundation for on-device and server-side fish species classification and large language model (LLM) advisory workflows, this second part focuses on the foundational engineering and data layers of the FishMap platform. Specifically, it reviews peer-reviewed scientific literature across three core research areas:
1. **Backend and Microservice Architecture:** Decomposition of system capabilities into domain services, inter-service coupling, API evolution strategies, and maintenance overheads in distributed cloud-native systems.
2. **Geospatial Data Storage, Indexing, and Spatial Queries:** Spatial indexing mechanisms, storage layouts, performance tradeoffs between write-heavy ingestion and multi-dimensional range/k-nearest-neighbor (k-NN) queries, and topological knowledge graph structures.
3. **Social Platforms, Privacy, and Security:** Threat models in online social networks (OSNs), cross-platform profiling risks, location privacy paradoxes, metadata exposure (e.g., EXIF coordinates in catch photos), and fine-grained access control mechanisms.

The goal of this review is to derive concrete, evidence-based architectural decisions and design patterns for the FishMap backend and database infrastructure, ensuring the system remains scalable, secure, and respectful of angler privacy.

---

## 2. Methodology

### 2.1 Search Strategy and Databases
The literature search was conducted in October 2026 across major scientific citation indexing databases and digital libraries:
- **Scopus / ScienceDirect (Elsevier)**
- **SpringerLink (Springer Nature)**
- **SpringerOpen / BioMed Central (BMC)**
- **IEEE Xplore / ACM Digital Library**
- **arXiv and university institutional open-access repositories** (e.g., Chalmers University of Technology, TU Eindhoven, McMaster University, Klagenfurt University) for verification of open-access author post-prints.

### 2.2 Search Queries
Specific keyword combinations and Boolean operators were used to identify relevant peer-reviewed studies:
- *Area 1 (Backend & Microservices):* `("microservice architecture" OR "microservices") AND ("migration" OR "evolution" OR "API evolution") AND ("empirical study" OR "challenges")`
- *Area 2 (Geospatial Data & Indexing):* `("spatial indexing" OR "spatial data storage") AND ("LSM" OR "R-tree" OR "geospatial knowledge graph") AND ("spatial queries" OR "performance")`
- *Area 3 (Social Platforms & Privacy):* `("online social networks" OR "social network data") AND ("security and privacy" OR "privacy threats" OR "location privacy") AND ("sharing" OR "profiling")`

### 2.3 Inclusion and Exclusion Criteria
- **Inclusion Criteria:**
  1. Peer-reviewed scientific journal articles or major conference proceedings.
  2. Direct relevance to at least one of the three target domains (microservices, spatial data/indexing, social platform privacy/security).
  3. High publication quality, verified through indexing in Scopus and classification in Scopus CiteScore / SCImago Journal Rank (SJR) quartiles (prioritizing Q1/Q2).
  4. Publication date predominantly between 2021 and 2026 to capture contemporary software and cloud engineering realities.
  5. Availability of verified free full-text PDF access via the publisher (Gold Open Access) or a legitimate institutional repository (Green Open Access).
- **Exclusion Criteria:**
  1. Non-peer-reviewed blog posts, marketing whitepapers, vendor product pitches, or forum comments.
  2. Theoretical papers lacking empirical validation, benchmark experiments, or qualitative industrial evaluation.
  3. Works focused purely on hardware circuits, closed proprietary protocols, or unrelated application domains (e.g., clinical health records without architectural relevance).
  4. Pirated or copyright-infringing document repositories.

---

## 3. Analysis Table of Reviewed Publications

| ID | Full Citation and DOI | Research Area | Scopus Indexing & Quartile | Free Full-Text / PDF Link | Research Approach / Method | Main Findings (as reported by authors) | Limitations | Relevance to FishMap |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **S9** | Ayas, H. M., Leitner, P., & Hebig, R. (2023). An empirical study of the systemic and technical migration towards microservices. *Empirical Software Engineering*, 28(4), Article 85. https://doi.org/10.1007/s10664-023-10308-9 | Backend Architecture | Scopus Indexed; SJR 2023: Q1 (0.92, Software); CiteScore 2023: Q1 (85th percentile) | [Publisher Open Access PDF (CC BY 4.0)](https://link.springer.com/content/pdf/10.1007/s10664-023-10308-9.pdf); [PMC10201508](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10201508/) | Qualitative Grounded Theory: 19 semi-structured interviews with software architects + qualitative analysis of 215 StackOverflow discussions on migration challenges. | Identifies 14 migration activities and 53 technical solution outcomes. Shows that microservice migration succeeds only when architectural decomposition is accompanied by systemic infrastructure investments (API gateways, automated service registries, dedicated per-service databases). | Focuses on migration from legacy monoliths rather than greenfield monorepo microservice setups; based on practitioner recollections and developer question boards. | Validates FishMap's architectural structure: an API Gateway routing to bounded domain services (Auth, Users, Fishing, Inventory, Social, Chat, Weather, AI) with dedicated schemas. Warns against splitting code before boundary stabilization. |
| **S10** | Assunção, W. K. G., Krüger, J., Mosser, S., & Selaoui, S. (2023). How do microservices evolve? An empirical analysis of changes in open-source microservice repositories. *Journal of Systems and Software*, 204, Article 111788. https://doi.org/10.1016/j.jss.2023.111788 | Backend Architecture | Scopus Indexed; SJR 2023: Q1 (0.97, Software / Info Systems); CiteScore 2023: Q1 (90th percentile) | [Author Open Access Repository (TU Eindhoven)](https://jacobkrueger.github.io/assets/papers/Assuncao2023MicroserviceEvolution.pdf); [McMaster MacSphere](https://macsphere.mcmaster.ca/handle/11375/28574) | Empirical repository mining: mixed quantitative change-coupling analysis and qualitative inspection of 7,319 Git commits across 11 open-source microservice systems. | Proves that microservices rarely evolve in total isolation. Many services co-evolve in tightly coupled groups ("tuples"). Identifies frequent "shotgun surgery" commits where a single logical feature update forces coordinated edits across multiple repositories. | Examined public open-source microservice systems on GitHub, which may have looser governance than commercial cloud-native teams; analyzed systems varied in lifecycle maturity. | Strong warning against premature multi-repository fracturing in FishMap. Supports keeping FishMap as a unified monorepo so that cross-service schema or contract migrations (e.g., Social and Users) can be reviewed and tested atomically. |
| **S11** | Lercher, A., Glock, J., Macho, C., & Pinzger, M. (2024). Microservice API Evolution in Practice: A Study on Strategies and Challenges. *Journal of Systems and Software*, 215, Article 112110. https://doi.org/10.1016/j.jss.2024.112110 | Backend Architecture | Scopus Indexed; SJR 2023: Q1 (0.97, Software / Info Systems); CiteScore 2023: Q1 (90th percentile) | [arXiv Open Access Preprint](https://arxiv.org/pdf/2405.02107); [Publisher Landing Page](https://doi.org/10.1016/j.jss.2024.112110) | Qualitative empirical interview study: 17 semi-structured interviews with developers, architects, and engineering managers across 11 commercial software companies. | Categorizes 6 industrial API evolution strategies (strict backward compatibility, consumer-driven contracts, semantic versioning) and 6 recurring challenges (change impact overhead, breaking communication). Breaking changes cause consumer lock-in and API degradation. | Investigates organizational perceptions and human practices; does not measure real-time network latency or binary serialization overheads. | Mandates strict backward compatibility for FishMap REST/JSON APIs across Flutter mobile releases. Mobile users do not update apps simultaneously, making breaking payload alterations a critical service failure point. |
| **S12** | Mao, Q., Qader, M. A., & Hristidis, V. (2023). Comparison of LSM indexing techniques for storing spatial data. *Journal of Big Data*, 10, Article 51. https://doi.org/10.1186/s40537-023-00734-3 | Geospatial Data | Scopus Indexed; SJR 2023: Q1 (1.96, Info Systems / Computer Networks); CiteScore 2023: Q1 (94th percentile) | [Publisher Open Access PDF (CC BY 4.0)](https://journalofbigdata.springeropen.com/counter/pdf/10.1186/s40537-023-00734-3.pdf) | Experimental benchmarking: implementation and performance evaluation of three stack-based spatial merge policies versus leveled merge policies in Apache AsterixDB under varied spatial workloads. | Evaluates spatial multi-dimensional indexing under write-intensive and read-intensive loads. Proves that leveled merge policies underperform stack-based policies for spatial queries because bounding boxes overlap excessively across levels, creating severe read amplification. | Evaluated within a distributed LSM-tree framework (AsterixDB); does not benchmark classic B-tree/R-tree relational PostGIS engines on single-node relational databases. | Highlights the critical tradeoff between ingestion throughput and spatial query efficiency. Confirms that spatial queries (bounding box, radius) require spatial partitioning (such as PostGIS R-tree/GiST) to prevent high query latency during spot lookups. |
| **S13** | Wei, B., Guo, X., Li, X., Wu, Z., Zhao, J., & Zou, Q. (2024). Construct and Query A Fine-Grained Geospatial Knowledge Graph. *Data Science and Engineering*, 9(1), 70–84. https://doi.org/10.1007/s41019-023-00237-4 | Geospatial Data | Scopus Indexed; SJR 2023: Q1 (1.21, AI / Info Systems / Software); CiteScore 2023: Q1 (88th percentile) | [Publisher Open Access PDF (CC BY 4.0)](https://link.springer.com/content/pdf/10.1007/s41019-023-00237-4.pdf) | Algorithmic design and empirical evaluation: developed the FineGeoKG framework, defined six Strong Geospatial Relations (SGRs), edge indexing, and optimized binary join algorithms for subgraph queries. | Demonstrates that standard geometric queries fail to model rich topological relationships (adjacency, river containment, directional proximity). Graph-spatial edge indexing speeds up complex multi-entity spatial queries by up to an order of magnitude. | High initial construction overhead for calculating fine-grained interlinks; evaluated on formal geographic datasets rather than volatile crowdsourced user spots. | Demonstrates how FishMap can evolve beyond simple latitude/longitude points: modeling fishing spots as entities linked to specific waterbodies, river basins, access roads, and fish species habitats enables contextual AI recommendations. |
| **S14** | Jain, A. K., Sahoo, S. R., & Kaubiyal, J. (2021). Online social networks security and privacy: comprehensive review and analysis. *Complex & Intelligent Systems*, 7(5), 2157–2177. https://doi.org/10.1007/s40747-021-00409-7 | Social Platforms & Security | Scopus Indexed; SJR 2023: Q1 (1.08, AI / Info Systems); CiteScore 2023: Q1 (87th percentile) | [Publisher Open Access PDF (CC BY 4.0)](https://link.springer.com/content/pdf/10.1007/s40747-021-00409-7.pdf) | Comprehensive systematic review and comparative analysis: taxonomic classification of OSN security threats, application-level vulnerabilities, and defensive countermeasures. | Categorizes primary OSN attack vectors: identity cloning, unauthorized tracking, photo metadata exploitation, and friend-network crawling. Concludes that complex privacy settings cause accidental oversharing, recommending privacy-by-default and automated metadata scrubbing. | Broad literature survey; does not evaluate user behavior in outdoor/recreational niche networks or measure performance penalties of specific crypto-schemes. | Directly dictates FishMap's social security posture: mandatory server-side EXIF scrubbing on uploaded catch photos (to prevent unintended coordinate leakage), JWT token validation at the gateway, and simple, explicit privacy toggles. |
| **S15** | Cerruto, F., Cirillo, S., Desiato, D., Gambardella, S. M., & Polese, G. (2022). Social network data analysis to highlight privacy threats in sharing data. *Journal of Big Data*, 9, Article 21. https://doi.org/10.1186/s40537-022-00566-7 | Social Platforms & Security | Scopus Indexed; SJR 2023: Q1 (1.96, Info Systems / Computer Networks); CiteScore 2023: Q1 (94th percentile) | [Publisher Open Access PDF (CC BY 4.0)](https://journalofbigdata.springeropen.com/counter/pdf/10.1186/s40537-022-00566-7.pdf) | Empirical data mining and profiling: developed the SODA (SOcial Data Analyzer) tool using face and image matching across 5,000 public social profiles to evaluate cross-platform re-identification. | Demonstrates that isolated pieces of shared data (avatar, gear mentions, approximate location) can be automatically correlated across platforms to de-anonymize users and infer private personal routines and sensitive habits. | Focuses on public cross-platform crawling across mainstream networks (Facebook, Twitter/X, Instagram, LinkedIn); does not evaluate end-to-end encrypted messaging. | Reinforces the privacy requirement expressed in angler interviews: anglers want control over who sees their catches, tackle, and spots. Validates FishMap's three-tier visibility model (public, friends-only, private) and strict rate-limiting on profile endpoints. |

---

## 4. Comparative Synthesis

### 4.1 Backend and Microservice Architecture

The literature underscores a fundamental dichotomy in modern microservice engineering: while microservices promise operational decoupling, independent scalability, and organizational agility, realizing these benefits in practice requires overcoming significant architectural friction.

1. **Systemic Foundations vs. Surface Decomposition:**  
   Ayas et al. (S9) show that migrating to or building microservices is not merely a task of cutting code into separate repositories. It requires establishing mature supporting infrastructure: unified API gateways, standardized service discovery, containerization, and dedicated database schemas per service. Without these foundations, teams experience severe operational drag. FishMap adheres directly to this principle by employing an API Gateway (port 4000) that encapsulates domain services (`auth:4001`, `users:4002`, `fishing:4003`, `inventory:4004`, `social:4005`, `chat:4006`, `weather:4007`, `ai:4008`), while container health checks ensure predictable startup ordering.

2. **The Reality of Co-Evolution and Shotgun Surgery:**  
   The empirical findings of Assunção et al. (S10) challenge the common assumption that microservices evolve independently. Across thousands of commits in open-source systems, services frequently co-evolved in tightly coupled groups, and bug fixes or feature additions frequently required "shotgun surgery" across multiple repositories. For FishMap, this provides strong justification for maintaining a **monorepo structure** (with distinct service subdirectories under `backend/services/`). In a team developing a specialized social network, a monorepo eliminates distributed version drift, enables atomic contract changes, and prevents cross-repository merge synchronization failures.

3. **API Contract Stability and Consumer Protection:**  
   Lercher et al. (S11) demonstrate that changing microservice APIs in production carries high coordination costs and risks consumer lock-in or breaking failures. In mobile applications like FishMap, API evolution is even more constrained than in web-only environments because mobile client updates are asynchronous: end-users may continue running older Flutter APK or IPA builds for months. Consequently, FishMap's backend must enforce strict backward compatibility, provide optional/defaulted payload parameters, and version breaking routes at the API Gateway level rather than modifying active schema endpoints in-place.

### 4.2 Geospatial Data Storage, Indexing, and Spatial Queries

Geospatial functionality is the core differentiator of FishMap: anglers discover fishing spots, evaluate waterbody boundaries, record catch coordinates, and request location-specific lure recommendations.

1. **Indexing Architectures and Spatial Query Amplification:**  
   Mao et al. (S12) investigate spatial data indexing and reveal that multi-dimensional spatial data cannot be managed like flat sequential records. When spatial data is written across storage tiers (such as in LSM-trees), improper merge policies cause severe bounding box overlaps between storage files, leading to catastrophic read amplification during bounding box queries. In FishMap's architecture, fishing spots and catch logs are stored in PostgreSQL enhanced with PostGIS. PostGIS utilizes **Generalized Search Tree (GiST)** R-tree indexing. R-tree indexing groups nearby spatial objects into hierarchical bounding boxes, allowing $O(\log N)$ spatial range queries and nearest-neighbor ($k$-NN) calculations (`<->` operator). This avoids the bounding box fragmentation and query degradation analyzed by S12.

2. **From Coordinate Points to Semantic Spatial Knowledge:**  
   Wei et al. (S13) demonstrate that simple point coordinates $(lat, lon)$ fail to capture the ecological and physical reality of geography. By formalizing Strong Geospatial Relations (SGRs) such as topological containment, river connectivity, and directional proximity, spatial querying can answer complex domain questions. In the context of FishMap, this supports enhancing spot records beyond isolated GPS markers: spots must be associated with parent waterbody entities (e.g., the Kigach River, Fortunata canal, or Caspian coastal zone), depth profiles, and target species habitats. This structural linkage provides rich domain context that the FishMap AI assistant can query when explaining seasonal lure choices or local fishing regulations.

### 4.3 Social Platforms, Privacy, and Security

Social fishing networks introduce specific privacy risks that standard social networks do not share: anglers are notoriously protective of their productive fishing spots ("honey holes"), while wildlife regulations mandate responsible reporting of protected species.

1. **Vulnerabilities in Media and Network Traversal:**  
   Jain et al. (S14) document that photo sharing in social networks is one of the highest-risk vectors for accidental data leakage. Anglers taking photos of catches in the field often have GPS geotagging enabled on their smartphones. If an application publishes the raw photo without processing, third parties can extract exact coordinates from EXIF metadata, exposing a secret spot against the angler's intent. To counter this, FishMap must implement **automatic server-side EXIF stripping** in its upload pipeline (`backend/services/social/src/middlewares/upload.middleware.js`), ensuring images stored in public storage contain only clean pixel data.

2. **Cross-Platform Profiling and Granular Access Controls:**  
   Cerruto et al. (S15) show how automated scraping tools can combine fragmented public profile information (avatars, gear lists, timestamps) to build comprehensive behavioral dossiers. This directly reinforces the findings from FishMap's user interviews (participant P1 explicitly stating an unwillingness to share certain locations publicly). FishMap addresses this threat through architectural mechanisms:
   - **Three-Tier Visibility Controls:** Spots, catches, and gear inventory can be marked as `private`, `friends-only`, or `public`.
   - **Attribute-Level Privacy:** Anglers can share a photo and story of a catch to the public social feed while masking or blurring the exact GPS coordinates.
   - **Gateway Security:** The API Gateway enforces JWT-based authentication, rate limiting, and input sanitization to prevent automated scraping of angler profiles and spot coordinates.

---

## 5. Evidence-Based Implications for FishMap

The synthesis of reviewed literature directly informs the implementation and roadmap of FishMap:

| Research Area | Academic Finding from Literature | Specific FishMap Architectural Decision |
|:---|:---|:---|
| **Backend Architecture** | Microservices require mature supporting infrastructure (gateways, isolated databases, contract testing) to avoid failure (S9). | Maintain unified API Gateway (port 4000) for client routing, request validation, and service abstraction. Maintain dedicated databases per microservice. |
| **Backend Architecture** | Microservices frequently co-evolve; multi-repo architectures suffer from "shotgun surgery" and contract drift (S10). | Keep FishMap as a monorepo containing `backend/services/*`, `frontend/flutter_app`, and shared infrastructure, ensuring synchronized changes. |
| **Backend Architecture** | Breaking API changes cause consumer degradation and client failures (S11). | Enforce strict backward compatibility on REST endpoints to accommodate mobile clients on older versions. Use non-breaking field additions. |
| **Geospatial Data** | Multi-dimensional spatial data requires dedicated spatial indexing to prevent bounding box overlap and query amplification (S12). | Implement PostGIS GiST spatial indexing on spot and catch coordinates; use native PostGIS functions (`ST_DWithin`, `ST_MakePoint`, `ST_Distance`) for bounding-box queries. |
| **Geospatial Data** | Linking coordinate points to relational geographical entities accelerates queries and enriches semantics (S13). | Relate fishing spots to waterbody and basin records in `fishmap_fishing` to allow semantic filtering and contextual AI advice. |
| **Social & Security** | User photos leak sensitive geolocation through EXIF metadata; user privacy controls are often misunderstood (S14). | Automatically strip EXIF geolocation metadata from uploaded images before storage; provide simple, transparent privacy settings per post. |
| **Social & Security** | Automated cross-referencing of public social data compromises user anonymity and location secrets (S15). | Support granular spot and inventory visibility (`private`, `friends-only`, `public`); decouple catch showcase posts from exact map coordinates; enforce gateway rate-limiting. |

---

## 6. Gaps and How FishMap Addresses Them

1. **Gap 1: Generic microservice studies lack mobile client synchronization analysis.**  
   *Assessment:* Studies S9, S10, and S11 evaluate backend microservice evolution but primarily discuss enterprise web systems or open-source libraries. They do not deeply analyze the constraints of mobile clients with intermittent network connectivity in outdoor environments.  
   *FishMap Mitigation:* FishMap implements offline-tolerant state caching in Flutter and ensures all API payload changes are strictly backward compatible.

2. **Gap 2: Spatial indexing studies focus on big-data clusters rather than localized outdoor services.**  
   *Assessment:* Study S12 analyzes LSM-tree spatial merge policies in distributed big data engines (AsterixDB). While theoretically informative, it does not evaluate relational spatial extensions like PostGIS for regional-scale angler communities.  
   *FishMap Mitigation:* FishMap utilizes PostGIS on PostgreSQL 16 with GiST indexing, which is proven and optimized for sub-second spatial queries on millions of point geometries.

3. **Gap 3: Social privacy literature focuses on general social media rather than recreational sports communities.**  
   *Assessment:* Studies S14 and S15 focus on general social platforms (Facebook, Instagram, LinkedIn). They do not address the unique "secret spot" culture of angling, where location disclosure has economic, competitive, and conservation consequences.  
   *FishMap Mitigation:* FishMap incorporates angler-specific privacy features: catch posts can be published publicly without revealing exact GPS coordinates, and private spots remain strictly visible only to the creator.

---

## 7. Conclusion

This literature review establishes a rigorous scientific and architectural foundation for the FishMap backend, geospatial data layer, and social security framework. By grounding our engineering choices in recent peer-reviewed research (all 7 reviewed works published between 2021 and 2024 in Scopus Q1 journals), FishMap avoids common pitfalls of distributed systems:

- **Monorepo microservice coordination** mitigates the co-evolution and shotgun surgery overheads identified in the literature (S9, S10).
- **Strict REST contract backward compatibility** ensures stable mobile client operation without consumer degradation (S11).
- **PostGIS GiST indexing and spatial entity relationships** provide high-performance spatial querying while laying the foundation for semantic, ecological spot recommendations (S12, S13).
- **Privacy-by-design principles**, including automated EXIF metadata scrubbing and three-tier visibility toggles, protect angler secrecy and comply with modern data privacy expectations (S14, S15).

Together with Part 1 (`docs/literature-review-client-ai.md`), this document completes the literature review requirements for the FishMap project, providing a unified, evidence-based engineering roadmap across both client and server domains.

---

## 8. References

1. **[S9]** Ayas, H. M., Leitner, P., & Hebig, R. (2023). An empirical study of the systemic and technical migration towards microservices. *Empirical Software Engineering*, 28(4), Article 85. https://doi.org/10.1007/s10664-023-10308-9
2. **[S10]** Assunção, W. K. G., Krüger, J., Mosser, S., & Selaoui, S. (2023). How do microservices evolve? An empirical analysis of changes in open-source microservice repositories. *Journal of Systems and Software*, 204, Article 111788. https://doi.org/10.1016/j.jss.2023.111788
3. **[S11]** Lercher, A., Glock, J., Macho, C., & Pinzger, M. (2024). Microservice API Evolution in Practice: A Study on Strategies and Challenges. *Journal of Systems and Software*, 215, Article 112110. https://doi.org/10.1016/j.jss.2024.112110
4. **[S12]** Mao, Q., Qader, M. A., & Hristidis, V. (2023). Comparison of LSM indexing techniques for storing spatial data. *Journal of Big Data*, 10, Article 51. https://doi.org/10.1186/s40537-023-00734-3
5. **[S13]** Wei, B., Guo, X., Li, X., Wu, Z., Zhao, J., & Zou, Q. (2024). Construct and Query A Fine-Grained Geospatial Knowledge Graph. *Data Science and Engineering*, 9(1), 70–84. https://doi.org/10.1007/s41019-023-00237-4
6. **[S14]** Jain, A. K., Sahoo, S. R., & Kaubiyal, J. (2021). Online social networks security and privacy: comprehensive review and analysis. *Complex & Intelligent Systems*, 7(5), 2157–2177. https://doi.org/10.1007/s40747-021-00409-7
7. **[S15]** Cerruto, F., Cirillo, S., Desiato, D., Gambardella, S. M., & Polese, G. (2022). Social network data analysis to highlight privacy threats in sharing data. *Journal of Big Data*, 9, Article 21. https://doi.org/10.1186/s40537-022-00566-7
