# Literature Review, Part 1: Computer Vision and Recommendations

**Author:** Bibifatima Biysheva
**Task:** FIS-3
**Scope of this part:** fish species recognition from photos, its use in recreational fishing applications, and recommender systems (including language-model-based ones). Sources on the server side, geospatial data, and social features are reviewed in part 2 by the co-author.

## 1. Method

- **Search.** Sources were searched on the web in October 2026 with queries about fish species classification with deep learning, machine vision in fish classification, recreational fishing applications with species identification, and deep-learning and LLM-based recommender systems.
- **Selection criteria.** Peer-reviewed reviews and studies were preferred; sources from 2021–2026 form the core body, and older works are kept as foundational. Two non-scientific sources (an institutional news page and a news article) are used only as context about existing applications.
- **Limitation.** The search covers a limited number of sources; it will be extended during the project, and the combined list with part 2 is checked against the minimum of 12 sources, including 8 scientific publications.

## 2. Sources

| ID | Source | Type | Year | Role in the review |
|---|---|---|---|---|
| S1 | Li, D., Wang, Q., Li, X., Niu, M., Wang, H., Liu, C. *Recent advances of machine vision technology in fish classification.* ICES Journal of Marine Science, 79(2), 263–284. https://doi.org/10.1093/icesjms/fsab264 | Scientific review | 2022 | Overview of methods and datasets for fish classification |
| S2 | Barbedo, J. G. A. *A Review on the Use of Computer Vision and Artificial Intelligence for Fish Recognition, Monitoring, and Management.* Fishes, 7(6), 335. https://doi.org/10.3390/fishes7060335 | Scientific review | 2022 | Challenges and research gaps in practical use |
| S3 | Silva, C. N. S., Dainys, J., Simmons, S., Vienožinskis, V., Audzijonyte, A. *A Scalable Open-Source Framework for Machine Learning-Based Image Collection, Annotation and Classification: A Case Study for Automatic Fish Species Identification.* Sustainability, 14(21), 14324. https://doi.org/10.3390/su142114324 | Scientific study | 2022 | Species identification from photos of a recreational fishing app |
| S4 | Kheriji, L., Kouadri, A., Mansouri, M. *Deep Learning for Sustainable Aquaculture: Opportunities and Challenges.* Sustainability, 17(11), 5084. https://doi.org/10.3390/su17115084 | Scientific review | 2025 | Lightweight models, edge computing, data scarcity |
| S5 | Zhao, Z., Fan, W., Li, J., Liu, Y., Mei, X., Wang, Y., Wen, Z., Wang, F., Zhao, X., Tang, J., Li, Q. *Recommender Systems in the Era of Large Language Models (LLMs).* IEEE Transactions on Knowledge and Data Engineering. https://doi.org/10.1109/TKDE.2024.3392335 | Scientific survey | 2024 | Language models in recommendation |
| S6 | Yang, X., Zhang, S., Liu, J., Gao, Q., Dong, S., Zhou, C. *Deep learning for smart fish farming: applications, opportunities and challenges.* arXiv:2004.11848. https://arxiv.org/abs/2004.11848 | Scientific review (preprint) | 2020 | Species classification, similar species, labelled-data bottleneck |
| S7 | Zhang, S., Yao, L., Sun, A., Tay, Y. *Deep Learning Based Recommender System: A Survey and New Perspectives.* ACM Computing Surveys, 52(1). https://doi.org/10.1145/3285029 | Scientific survey | 2019 | Foundations of deep-learning-based recommendation |
| S8 | Batmaz, Z., Yurekli, A., Bilge, A., Kaleli, C. *A review on deep learning for recommender systems: challenges and remedies.* Artificial Intelligence Review, 52(1), 1–37. https://doi.org/10.1007/s10462-018-9654-y | Scientific review | 2019 | Challenges of recommender systems and remedies |
| C1 | Virginia Institute of Marine Science. *Researchers at VIMS looking for fish photos to help development of fish recognition app (RecFish).* https://www.vims.edu/newsandevents/topstories/2021/recfish.php | Institutional news (context) | 2021 | Example of a planned angler app with species ID and legality information |
| C2 | Queensland Department of Agriculture and Fisheries. *Qld Fishing 2.0* (news article of 27 September 2023, psnews.com.au). https://psnews.com.au/?p=49256 | News article (context) | 2023 | Example of an existing app with species recognition for a limited number of species |

Of the 8 scientific sources, 5 are from 2021–2026 and 3 are foundational (2019–2020). The two context sources are not counted among the scientific publications.

## 3. Analysis table

| ID | Approach | Main findings (as reported) | Limitations for this project | Relevance to FishMap |
|---|---|---|---|---|
| S1 | Review of machine vision for fish classification: image acquisition, preprocessing, classification with traditional machine learning and with deep learning | Deep learning learns features automatically; transfer learning reduces the need for data; public datasets exist but differ in species and conditions; models built on controlled images are less useful in real conditions | Focus mainly on aquaculture and underwater imagery rather than anglers' smartphone photos | Supports fine-tuning of a pretrained model (AI-01); reminds that dataset conditions determine usefulness; source of dataset candidates |
| S2 | Review that concentrates on challenges and research gaps in computer vision for fish | Prevalent weaknesses block wider use under real-world conditions | Works at the level of the field; no concrete model for angler apps | Basis for stating limitations honestly and for risk R3 (accuracy in real photos) |
| S3 | Open-source framework and pilot study: six freshwater species, photos from a recreational fishing app, transfer learning with TensorFlow Lite Model Maker | Best classification model reached overall accuracy of 0.91 with EfficientNet-Lite0; other tested models scored lower; one species was often confused with three others; augmentation improved accuracy; classification worked better than object detection; expert annotation of photos is a bottleneck | Small dataset and only six species; authors recommend caution when interpreting results | Closest analogue to FishMap: same data source type (angler app photos), same approach; shows realistic scale of data and effort; supports species-list restriction and manual confirmation |
| S4 | Review of deep learning in aquaculture, including lightweight architectures | Challenges include data scarcity, real-time performance, generalization; future directions include edge computing and lightweight models | Aquaculture setting; not specific to recreational fishing | Background for the decision on server-side vs on-device inference (kept as a later option) |
| S5 | Survey of recommender systems empowered by large language models (pre-training, fine-tuning, prompting) | Organizes how language models are used to improve recommendation | General survey; does not evaluate fishing or equipment recommendations | Context for the AI service that uses a language model for lure advice; supports keeping a rule-based fallback and evaluating recommendations |
| S6 | Review of deep learning in aquaculture, including species classification | Species classification is hard because of changing light, motion, and similar shapes; transfer learning with small datasets is common; a large amount of labelled data is a bottleneck | Preprint; aquaculture focus | Explains why similar species are confused (top-3 suggestions, confidence threshold in AI-03) |
| S7 | Survey and taxonomy of deep-learning-based recommendation models | Recommendation models are usually grouped as collaborative filtering, content-based, and hybrid | General survey; not about small apps with little user data | Framework for choosing a recommendation approach; a small app has few users, so content-based and rule-based ideas are more realistic at first |
| S8 | Review of deep-learning recommendation approaches, their challenges and remedies | Analyses models used, challenges (such as accuracy, scalability, sparsity), and application domains | General review | Helps to identify typical recommender problems (e.g. little data) that apply to FishMap |
| C1 | Institutional news: a planned angler app that identifies species from photos | Plans species ID, length and weight, date and time, legality of catch; needs many photos for training | Not a peer-reviewed source; the app was in development at the time of the article | Shows demand for species identification and legality information in angler apps |
| C2 | News article about a government app | Identifies a limited number of common species, shows fishing rules for a location, users can submit photos to improve the tool, can work with limited signal | Secondary source; claims are quoted from a press statement | Shows that practical apps restrict the species list and combine identification with rules |

## 4. Critical review

### 4.1 Fish species recognition from images

The reviewed surveys agree on the general direction of the field. Early systems used hand-crafted features and classical classifiers, and deep learning replaced manual feature design with learned features (S1). Because labelled fish data are limited, many studies start from a pretrained network and fine-tune it, which reduces the amount of data and training time (S1, S6). At the same time, the surveys point to persistent difficulties: changes in light and motion, similar shapes and patterns of different species, and the lack of labelled data (S6). S2 stresses that the main problems are not new architectures but weaknesses that stop the technology from working in real-world conditions. S1 also warns that models trained on controlled images are less useful in practice and that pre-training can even harm accuracy when the source and target tasks are too different.

Most of these works are set in aquaculture or underwater video. They are useful for understanding methods and datasets, but they do not describe the typical FishMap input: a smartphone photo of a caught fish, often held in a hand or lying on the ground, taken in changing light.

### 4.2 Species identification in recreational fishing

S3 is the closest to the project. The authors build a modular open-source workflow and test it on photos from a recreational fishing application, for six freshwater species. Fine-tuning a small pretrained network gave an overall accuracy of 0.91 on their data, one species was often confused with several others, and expert annotation was the most time-consuming step. The authors note that the dataset was small and that results should be interpreted with caution. Two practical examples (C1, C2) support the same picture: angler apps either plan species recognition and need many photos (C1), or support a limited number of species and combine recognition with fishing rules (C2).

For FishMap this suggests three choices: restrict the list of supported species and document it (AI-01), show several suggestions with a confidence value and let the user correct the result (FR-C08, AI-03), and budget time for collecting and checking data (R2).

### 4.3 Lightweight and on-device models

S4 lists lightweight models and edge computing among the future directions and data scarcity and real-time performance among the open challenges. This is relevant because anglers often fish with weak network coverage. In this project, server-side inference is chosen first because it integrates directly with the existing AI service, while on-device inference is kept as a later improvement (see the technology comparison).

### 4.4 Recommender systems

The surveys describe recommendation models by the data they use: collaborative filtering, content-based, and hybrid approaches (S7), and discuss typical challenges and remedies (S8). A recent survey reviews how large language models are used in recommendation through pre-training, fine-tuning, and prompting (S5). None of these sources is about fishing equipment, and they do not tell how well recommendations work for a small application with few users.

For FishMap, the consequence is practical. With few users there is little interaction data for collaborative filtering, so recommendations of lures should start from the user's own inventory, conditions such as weather, and rules, with a language model used for explanations or advice. The current AI service already combines a language model with a rule-based fallback; this combination is consistent with the prompting-based direction described in S5, but its quality has to be measured in the evaluation, not assumed.

## 5. Gaps and how the project takes them into account

| Gap or limitation found in the sources | How the project takes it into account |
|---|---|
| Most fish-recognition work uses aquaculture or underwater data, not angler photos (S1, S2, S6) | Use photos typical for anglers; evaluate on a separate test set with different lighting and backgrounds; report problem cases separately |
| Similar species are confused (S3, S6) | Top-3 suggestions, confidence threshold, manual choice (FR-C08, AI-03) |
| Labelled data are scarce and expert annotation is costly (S3, S6) | Restrict the number of species; document dataset sources and licences (AI-04); plan the data work early |
| Lightweight and on-device models are an open direction (S4) | Server-side inference first; on-device kept as a later option |
| Recommendation sources do not address fishing equipment or small data (S5, S7, S8) | Start from inventory-, conditions-, and rule-based recommendations; evaluate against a simple baseline |
| Among the sources found in this search, none combines species identification, equipment inventory, social features, and recommendations in one application | To be checked in the existing system comparison; the proposed combination is the project's contribution only if the comparison confirms it |

## 6. Conclusions for the project

1. Fine-tuning a pretrained image classifier is the established approach for limited fish data and is consistent with the practice in recreational fishing applications.
2. Realistic expectations require a limited species list, a documented dataset, and honest reporting of confusions between similar species.
3. Recommendations should be designed for little data and evaluated against a baseline.
4. The review will be extended with sources on regulations, geospatial features, and user needs, and combined with part 2.

## 7. References

1. Li, D., Wang, Q., Li, X., Niu, M., Wang, H., & Liu, C. (2022). Recent advances of machine vision technology in fish classification. *ICES Journal of Marine Science, 79*(2), 263–284. https://doi.org/10.1093/icesjms/fsab264
2. Barbedo, J. G. A. (2022). A review on the use of computer vision and artificial intelligence for fish recognition, monitoring, and management. *Fishes, 7*(6), 335. https://doi.org/10.3390/fishes7060335
3. Silva, C. N. S., Dainys, J., Simmons, S., Vienožinskis, V., & Audzijonyte, A. (2022). A scalable open-source framework for machine learning-based image collection, annotation and classification: A case study for automatic fish species identification. *Sustainability, 14*(21), 14324. https://doi.org/10.3390/su142114324
4. Kheriji, L., Kouadri, A., & Mansouri, M. (2025). Deep learning for sustainable aquaculture: Opportunities and challenges. *Sustainability, 17*(11), 5084. https://doi.org/10.3390/su17115084
5. Zhao, Z., Fan, W., Li, J., Liu, Y., Mei, X., Wang, Y., Wen, Z., Wang, F., Zhao, X., Tang, J., & Li, Q. (2024). Recommender systems in the era of large language models (LLMs). *IEEE Transactions on Knowledge and Data Engineering*. https://doi.org/10.1109/TKDE.2024.3392335
6. Yang, X., Zhang, S., Liu, J., Gao, Q., Dong, S., & Zhou, C. (2020). Deep learning for smart fish farming: Applications, opportunities and challenges. arXiv:2004.11848. https://arxiv.org/abs/2004.11848
7. Zhang, S., Yao, L., Sun, A., & Tay, Y. (2019). Deep learning based recommender system: A survey and new perspectives. *ACM Computing Surveys, 52*(1). https://doi.org/10.1145/3285029
8. Batmaz, Z., Yurekli, A., Bilge, A., & Kaleli, C. (2019). A review on deep learning for recommender systems: Challenges and remedies. *Artificial Intelligence Review, 52*(1), 1–37. https://doi.org/10.1007/s10462-018-9654-y
9. Virginia Institute of Marine Science. (2021). Researchers at VIMS looking for fish photos to help development of fish recognition app. https://www.vims.edu/newsandevents/topstories/2021/recfish.php
10. Public Sector News. (2023, September 27). Fish lovers land a software solution (Qld Fishing 2.0). https://psnews.com.au/?p=49256
