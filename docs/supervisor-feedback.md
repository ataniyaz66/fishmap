Supervisor Feedback
1. Review details
Item	Value
Supervisor	Alua Myrzakerimova
Materials reviewed	README, project proposal, requirements, repository history, YouTrack tasks 
2. Review text (as received)

Review of the materials for the testing period Topic: "Development of a cross-platform intelligent system for planning, tracking, and analyzing recreational fishing"

What went well

The topic is clear; the participants' areas of responsibility are divided and agreed upon in the README and in the description of the contribution.
The requirements are well formulated: each has a priority and a verifiable acceptance criterion. It is correct that the numerical targets for model accuracy and response time are not set in advance but will be determined after the first measurement.
Work is carried out through tasks in YouTrack and Pull Requests, with review by a second participant.

Comments and recommendations

Scope. The list of features is extensive for a team of two people. It is necessary to document what is included in the implementation for the first defense and what is postponed (primarily competitions, group chats, and the admin panel), and reflect this in the README and proposal.
Contribution of participants. The backend and part of the client were added in a single commit. It is necessary to clearly describe who did what, and then carry out the work in small commits from personal accounts so that each person's individual contribution is visible in the history.
Choice of technologies. It is necessary to justify the architecture (including microservices) based on the project requirements, not just on the fact of implementation.
AI component. By the end of November, determine the list of supported fish species, find a dataset, assess its volume and licensing, and obtain the first baseline. This is the main technical risk of the project.
Security. Do not store tokens in shared_preferences; check the repository for the absence of passwords and keys.
Data on fishing regulations. Identify the source of the data for Kazakhstan and the person responsible for its accuracy; otherwise, exclude this item from the priority list.
