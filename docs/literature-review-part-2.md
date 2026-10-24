# Literature Review, Part 2: Backend Architecture, Geospatial Data, and Social Platforms

**Author:** Ataniyaz Mutigolla  
**Task:** FIS-16  
**Project:** FishMap — Cross-Platform Social Network for Anglers  
**Scope:** Microservice architecture and API evolution; geospatial data storage, indexing, and queries; and privacy and access control in online social platforms.

*Part 1, covering fish-species identification and recommender systems, is documented separately in `docs/literature-review-client-ai.md`.*

---

## 1. Introduction and Purpose

FishMap is intended to help recreational anglers in Kazakhstan and elsewhere discover fishing locations, record catches, manage tackle, and interact through posts, comments, and friendships. These features create three important engineering challenges: organizing backend services without creating excessive coupling, querying location data efficiently, and protecting sensitive information such as private fishing spots.

This review examines seven peer-reviewed publications from 2021–2024. It uses them to inform possible design decisions for FishMap, while distinguishing findings reported by the studies from proposed implementation choices. The review does not treat a feature as implemented unless its presence has been verified in the project code or deployment.

The research areas are:

1. **Backend architecture:** microservice migration, service co-evolution, and API evolution.
2. **Geospatial data:** spatial indexing and richer relationships between geographic entities.
3. **Social-platform privacy and security:** profile correlation, location exposure, and access controls.

## 2. Methodology

### 2.1 Search strategy and sources

The literature search was conducted in October 2026 using publisher pages and scholarly records available through Springer Nature, ScienceDirect, PubMed Central, and author-hosted open-access copies. DOI links were used to identify the publications and compare bibliographic details with publisher records.

### 2.2 Search queries

The search used combinations of terms such as:

- **Backend and microservices:** `("microservice architecture" OR microservices) AND (migration OR evolution OR API evolution) AND (empirical study OR challenges)`
- **Geospatial data:** `("spatial indexing" OR "spatial data storage") AND (LSM OR R-tree OR "geospatial knowledge graph") AND ("spatial queries" OR performance)`
- **Social privacy:** `("online social networks" OR "social network data") AND (privacy OR security OR "location privacy") AND (sharing OR profiling)`

### 2.3 Inclusion and exclusion criteria

Studies were included when they were peer-reviewed journal articles or major conference publications, were directly relevant to one of the three research areas, and had a publication record and DOI that could be checked. Publications from 2021–2024 were selected to keep the review relatively recent. Open-access full text was preferred where available.

Non-peer-reviewed blog posts, vendor marketing materials, unrelated studies, and sources without a verifiable publication record were excluded.

**Indexing and quartile note:** Journal quartiles depend on the indexing database, subject category, and year. This review therefore does not assign a Q1/Q2 label or reproduce CiteScore/SJR values without a separately verified year-specific record. The presence of a DOI and open-access full text does not by itself prove a particular quartile.

## 3. Analysis of Reviewed Publications

| ID | Publication | Research area | Method and evidence | Main finding relevant to this review | Limitations and relevance to FishMap |
|---|---|---|---|---|---|
| **S9** | Ayas, H. M., Leitner, P., & Hebig, R. (2023). “An empirical study of the systemic and technical migration towards microservices.” *Empirical Software Engineering*, 28, Article 85. [DOI](https://doi.org/10.1007/s10664-023-10308-9) | Backend architecture | Qualitative study using 19 interviews and analysis of 215 Stack Overflow discussions, using grounded-theory techniques. | The authors describe migration as a multi-stage organizational and technical process, identifying 14 activities and 53 solution outcomes. They emphasize that migration involves supporting practices and infrastructure as well as code decomposition. | The study concerns migration journeys, not a controlled comparison of all possible greenfield architectures. For FishMap, it supports treating service boundaries, deployment, observability, and operational overhead as design concerns rather than assuming that more services automatically improve a system. |
| **S10** | Assunção, W. K. G., Krüger, J., Mosser, S., & Selaoui, S. (2023). “How do microservices evolve? An empirical analysis of changes in open-source microservice repositories.” *Journal of Systems and Software*, 204, Article 111788. [DOI](https://doi.org/10.1016/j.jss.2023.111788) | Backend architecture | Repository mining of 11 open-source microservice systems, covering 7,319 commits and almost 100,000 atomic changes, supplemented by qualitative analysis. | The study reports that service evolution often involves coordinated changes; isolated evolution is not the dominant pattern in the studied systems. | Open-source projects may differ from commercial systems and from FishMap's current scale. The result supports considering a monorepo for coordinated development, but it does **not** prove that a monorepo is always superior or that it eliminates coupling. |
| **S11** | Lercher, A., Glock, J., Macho, C., & Pinzger, M. (2024). “Microservice API Evolution in Practice: A Study on Strategies and Challenges.” *Journal of Systems and Software*, 215, Article 112110. [DOI](https://doi.org/10.1016/j.jss.2024.112110) | Backend architecture | 17 semi-structured interviews with developers, architects, and managers from 11 companies. | The study identifies six API-evolution strategies and six challenges. Strategies commonly emphasize backward compatibility, versioning, and collaboration; challenges include change-impact analysis and consumers remaining dependent on old API versions. | The study is qualitative and does not quantify latency or prove one universal versioning policy. It supports documenting FishMap API contracts, testing consumers, and avoiding breaking changes that would disrupt older mobile clients. |
| **S12** | Mao, Q., Qader, M. A., & Hristidis, V. (2023). “Comparison of LSM indexing techniques for storing spatial data.” *Journal of Big Data*, 10, Article 51. [DOI](https://doi.org/10.1186/s40537-023-00734-3) | Geospatial data | Experimental comparison of spatial LSM-index merge policies implemented in Apache AsterixDB, using real-world and synthetic spatial workloads. | The authors find that merge-policy and partitioning choices affect write throughput, write amplification, and spatial-query performance. Stack-based policies performed well across many tested settings; some leveled configurations achieved competitive read performance. | This is an LSM/AsterixDB study, not a benchmark of PostgreSQL/PostGIS. It cannot be used to claim that PostGIS is faster or slower. For FishMap, it illustrates that spatial-index performance depends on the database engine, index, workload, and configuration and should be benchmarked in the intended environment. |
| **S13** | Wei, B., Guo, X., Li, X., Wu, Z., Zhao, J., & Zou, Q. (2024). “Construct and Query A Fine-Grained Geospatial Knowledge Graph.” *Data Science and Engineering*, 9, 152–176. [DOI](https://doi.org/10.1007/s41019-023-00237-4) | Geospatial data | Design and experimental evaluation of FineGeoKG, a framework for representing and querying quantified neighboring relationships between geographic objects. | The work addresses geographic relationships that may be lost when data is represented only as separate objects or coordinates. It models relationships between neighboring spatial entities and evaluates queries over them. | The framework is not specifically designed for fishing apps or rapidly changing user-submitted spots. For FishMap, it motivates linking spots to relevant waterbodies and regions when reliable data is available; it does not establish that a graph database is required. |
| **S14** | Jain, A. K., Sahoo, S. R., & Kaubiyal, J. (2021). “Online social networks security and privacy: comprehensive review and analysis.” *Complex & Intelligent Systems*, 7, 2157–2177. [DOI](https://doi.org/10.1007/s40747-021-00409-7) | Social privacy and security | Review of online social-network security and privacy threats and proposed countermeasures. | The review surveys a broad range of OSN threats and defenses, emphasizing that privacy and security depend on both platform mechanisms and user-facing choices. | This is a broad review, not a FishMap-specific experiment. It supports privacy-by-design as a principle, but individual safeguards—such as EXIF removal, authorization rules, and rate limits—must be selected and tested against FishMap's threat model. |
| **S15** | Cerruto, F., Cirillo, S., Desiato, D., Gambardella, S. M., & Polese, G. (2022). “Social network data analysis to highlight privacy threats in sharing data.” *Journal of Big Data*, 9, Article 19. [DOI](https://doi.org/10.1186/s40537-022-00566-7) | Social privacy and security | Evaluation of SODA, a system that searches for and correlates profile information across social networks. The evaluation began with 7,000 people and found 5,000 on at least one social platform. | The study demonstrates how information available across multiple social platforms can be correlated to identify people and aggregate profile data. | The study is about cross-platform profile discovery, not fishing-location privacy specifically. It nevertheless illustrates why seemingly harmless profile details can become more revealing when combined. FishMap should minimize unnecessary public information and enforce access checks on private resources. |

## 4. Comparative Synthesis

### 4.1 Backend and microservice architecture

The three backend studies show that a microservice architecture does not remove complexity; it changes where that complexity appears. Ayas et al. (S9) describe the organizational and technical work involved in adopting microservices. Assunção et al. (S10) find that services in their sample frequently change together. Lercher et al. (S11) show that API changes create coordination problems, particularly when consumers rely on older versions.

For FishMap, these findings suggest the following design principles:

1. **Keep service boundaries explicit.** Services should represent clear business responsibilities, and communication between them should use documented interfaces.
2. **Avoid premature repository fragmentation.** A monorepo can make coordinated changes and shared testing easier for a small team, but it does not itself guarantee independent services or low coupling.
3. **Protect API compatibility.** Prefer additive, backward-compatible API changes where practical; document breaking changes and test affected clients and services.
4. **Measure operational complexity.** Health checks, centralized logs, configuration management, monitoring, and repeatable deployment are necessary considerations as the number of services grows.

These are recommendations derived from the literature, not claims that every supporting mechanism is already implemented in FishMap.

### 4.2 Geospatial data storage, indexing, and queries

Mao et al. (S12) evaluate spatial indexing within an LSM-based database system. Their results show that indexing and merge-policy choices affect performance under different workloads. The findings should not be transferred directly to PostGIS because the database architecture and index maintenance mechanisms differ.

If FishMap uses PostgreSQL with PostGIS, a spatial column and an appropriate GiST index are a reasonable design option for fishing spots and catch locations. Spatial functions such as `ST_DWithin` and `ST_Distance` can support proximity and distance calculations. However, actual performance depends on query structure, data volume, geometry type, index selectivity, and query plans. It should be measured with representative data rather than assumed to be sub-second or to have a guaranteed \(O(\log N)\) runtime.

Wei et al. (S13) explore a richer representation of geographic relationships. For FishMap, a practical first step is to associate spots with waterbodies or geographic regions using relational records and stable identifiers. A geospatial knowledge graph could be considered later if FishMap needs complex relationships that are difficult to express and query with its existing data model. The cited study does not establish that a graph database is necessary for a regional fishing application.

### 4.3 Social-platform privacy and security

Jain et al. (S14) survey security and privacy risks in online social networks. Cerruto et al. (S15) demonstrate how information from multiple social platforms can be correlated. Together, they support reducing unnecessary exposure and making authorization rules explicit.

Fishing locations may be sensitive even when a catch photograph is intended to be public. A photo can contain location metadata, and a post may reveal a location through its text or visible landmarks even after metadata has been removed. Therefore:

- **Separate post visibility from spot visibility.** A public catch post should not automatically make the exact fishing spot public.
- **Enforce authorization on the server.** Hiding a location or button in the client is not sufficient; every relevant API request must check whether the requester is allowed to view or change the resource.
- **Handle uploaded metadata deliberately.** Inspect uploaded media and, where appropriate, remove EXIF metadata before making images available to other users. Metadata removal does not hide coordinates written in captions or visible in the image.
- **Use simple privacy choices.** Options such as `private`, `friends-only`, and `public` are understandable only if the application clearly explains what each setting exposes.
- **Limit automated collection.** Rate limits, pagination limits, monitoring, and authorization checks can reduce some forms of scraping, though rate limiting alone cannot prevent all profiling.

These controls are proposed requirements for FishMap. They should be verified against the current code and tested before being described as implemented.

## 5. Evidence-Based Implications for FishMap

| Research area | Evidence from the reviewed literature | Recommended FishMap decision |
|---|---|---|
| Service architecture | Microservice migration involves infrastructure and organizational work, not only code separation (S9). | Document service responsibilities and contracts; assess operational cost as the service count grows. |
| Service evolution | Services in the studied systems often co-evolved (S10). | Keep coordinated code in a monorepo while it benefits the team; use automated tests to detect cross-service regressions. |
| API evolution | Backward compatibility, versioning, and change communication are recurring strategies and challenges (S11). | Prefer compatible API changes, document breaking changes, and test older mobile-client assumptions. |
| Spatial indexing | LSM spatial-index performance depends on merge policy, partitioning, and workload (S12). | Choose the spatial index for the actual database engine and validate it with representative FishMap queries and data volumes. |
| Geographic semantics | Fine-grained links between geographic entities can represent relationships that raw coordinates do not capture (S13). | Consider relational links between spots and waterbodies first; evaluate graph-based approaches only if a demonstrated query need emerges. |
| Privacy and security | OSN privacy risks require platform-level protections as well as understandable user choices (S14). | Define server-side access rules and clear visibility settings; review media processing and authentication controls. |
| Cross-platform profiling | Public profile data can be correlated across social platforms (S15). | Minimize exposed profile data and avoid exposing exact spot coordinates unless the owner explicitly allows it. |

## 6. Research Gaps and Practical Validation

### Gap 1: Mobile clients and API evolution

The reviewed API-evolution study (S11) is based on interviews across companies and does not specifically measure FishMap's mobile-client compatibility needs.

**FishMap response:** Treat backward compatibility as a design requirement. Verify it with API contract tests and tests for supported client versions. Offline caching or synchronization should only be claimed once the relevant behavior is implemented and tested.

### Gap 2: Spatial-index performance in FishMap's deployment

The LSM-index study (S12) uses Apache AsterixDB rather than PostgreSQL/PostGIS, so it cannot establish FishMap's query latency.

**FishMap response:** If PostGIS is selected, create representative test data and benchmark radius, bounding-box, and nearest-neighbor queries. Record dataset size, query plans, index definitions, and observed latency before making performance claims.

### Gap 3: Angler-specific location privacy

The reviewed social-network studies (S14 and S15) are not focused on anglers or the practice of keeping productive fishing locations private.

**FishMap response:** Define a threat model for private spots and catch posts. Test that users cannot access private coordinates through API responses, search, feeds, notifications, or media metadata. The exact requirements should be validated with anglers rather than inferred from general OSN studies alone.

## 7. Conclusion

The seven reviewed publications provide useful evidence for three areas of FishMap engineering. Microservice research shows that distributed service boundaries introduce coordination and API-evolution challenges as well as potential benefits. Geospatial research shows that query performance depends on the index architecture and workload, while richer geographic relationships can provide context beyond isolated coordinates. Social-platform research demonstrates that profile data and shared media can reveal more information than users intend.

The resulting recommendations are to maintain clear service contracts, avoid unnecessary repository fragmentation, protect API compatibility, benchmark spatial queries in the selected database, model relationships to waterbodies when useful, and enforce privacy on the server. In particular, public catch sharing should be designed separately from disclosure of exact fishing coordinates.

These are evidence-informed design recommendations, not proof that all listed features are currently implemented. Before the final project report is submitted, each implementation claim should be checked against the repository and tested behavior. Together with Part 1, this review provides the basis for a coordinated discussion of FishMap's client, AI, backend, geospatial, and privacy requirements.

## 8. References

1. **[S9]** Ayas, H. M., Leitner, P., & Hebig, R. (2023). An empirical study of the systemic and technical migration towards microservices. *Empirical Software Engineering, 28*, Article 85. https://doi.org/10.1007/s10664-023-10308-9  
   Open access: https://pmc.ncbi.nlm.nih.gov/articles/PMC10201508/

2. **[S10]** Assunção, W. K. G., Krüger, J., Mosser, S., & Selaoui, S. (2023). How do microservices evolve? An empirical analysis of changes in open-source microservice repositories. *Journal of Systems and Software, 204*, Article 111788. https://doi.org/10.1016/j.jss.2023.111788  
   Open-access author copy: https://jacobkrueger.github.io/assets/papers/Assuncao2023MicroserviceEvolution.pdf

3. **[S11]** Lercher, A., Glock, J., Macho, C., & Pinzger, M. (2024). Microservice API Evolution in Practice: A Study on Strategies and Challenges. *Journal of Systems and Software, 215*, Article 112110. https://doi.org/10.1016/j.jss.2024.112110  
   Open access: https://www.sciencedirect.com/science/article/pii/S0164121224001559

4. **[S12]** Mao, Q., Qader, M. A., & Hristidis, V. (2023). Comparison of LSM indexing techniques for storing spatial data. *Journal of Big Data, 10*, Article 51. https://doi.org/10.1186/s40537-023-00734-3  
   Open access: https://link.springer.com/article/10.1186/s40537-023-00734-3

5. **[S13]** Wei, B., Guo, X., Li, X., Wu, Z., Zhao, J., & Zou, Q. (2024). Construct and Query A Fine-Grained Geospatial Knowledge Graph. *Data Science and Engineering, 9*, 152–176. https://doi.org/10.1007/s41019-023-00237-4  
   Open access: https://link.springer.com/article/10.1007/s41019-023-00237-4

6. **[S14]** Jain, A. K., Sahoo, S. R., & Kaubiyal, J. (2021). Online social networks security and privacy: comprehensive review and analysis. *Complex & Intelligent Systems, 7*, 2157–2177. https://doi.org/10.1007/s40747-021-00409-7  
   Open access: https://link.springer.com/article/10.1007/s40747-021-00409-7

7. **[S15]** Cerruto, F., Cirillo, S., Desiato, D., Gambardella, S. M., & Polese, G. (2022). Social network data analysis to highlight privacy threats in sharing data. *Journal of Big Data, 9*, Article 19. https://doi.org/10.1186/s40537-022-00566-7  
   Open access: https://link.springer.com/article/10.1186/s40537-022-00566-7
