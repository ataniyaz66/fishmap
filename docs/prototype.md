UX Prototype
Task: FIS-7 Language of the interface: Russian (the client has a language switch).
1. Approach
The prototype consists of two kinds of materials:
2. Navigation structure
The bottom navigation of the client has five items: Feed, Map, Create, Anglers, Profile. The profile screen is the entry point for services: diary of catches, equipment box (inventory), AI advisor, fishing weather, and messages.
3. Scenarios and evidence
Scenario	Requirement	Evidence	Status
Register and log in	FR-C01	Figures 1, 2	Implemented
View profile and statistics	FR-C02	Figures 8, 9	Implemented
View map with fishing spots, filter by water type	FR-C03	Figure 3	Implemented
Add a fishing spot (name, coordinates, water type, fish, description, public flag)	FR-C04	Figures 4, 5	Implemented
Attach photos to a spot	FR-C05	Mockup, screen 3	Planned
Choose who sees a spot (only me / friends / public)	FR-C06	Figure 5 shows a public flag; mockup, screen 3	Partly implemented
Add a catch with a photo	FR-C07	Diary of catches with photos is shown in Figure 9; the add-catch screen is to be added	To be confirmed
Species suggestion from a photo	FR-C08, AI-01, AI-03	Mockup, screen 4	Planned
Manage equipment (list, add, delete, categories)	FR-C10	Figures 6, 7	Implemented
Inventory visibility settings	FR-C11	Mockup, screen 5	Planned
Find anglers, send friend requests	FR-C12	Figure 10	Implemented
Weather for fishing	FR-C14	Entry "Fishing weather" in Figure 9	Implemented (screen not shown)
Recommendations: lure selection and tactics advice	FR-C16	Figures 11, 12	Implemented
Feed and direct messages	Social features	Figures 13, 14	Implemented
4. Screens of the working client
Figure 1. Login Figure 1. Login screen.
Figure 2. Registration Figure 2. Registration screen.
Figure 3. Map Figure 3. Map with fishing spots and water-type filters; button for adding a spot.
Figure 4. Add spot, part 1 Figure 4. Add a spot: name, coordinates, water type, fish, description.
Figure 5. Add spot, part 2 Figure 5. Add a spot: the public flag and the save button.
Figure 6. Equipment box Figure 6. Equipment box with category filters.
Figure 7. Add equipment Figure 7. Add an equipment item: name, category, brand, colour, weight, quantity.
Figure 8. Profile Figure 8. Profile with statistics and the AI advisor entry.
Figure 9. Profile services Figure 9. Profile services: diary, equipment box, AI advisor, fishing weather, messages.
Figure 10. Anglers Figure 10. Search for anglers and friend requests.
Figure 11. AI advisor: lure selection Figure 11. AI advisor: lure selection by fish, water clarity and depth.
Figure 12. AI advisor: tactics Figure 12. AI advisor: question about tactics and the answer.
Figure 13. Feed Figure 13. Feed with a post.
Figure 14. Chat Figure 14. Direct messages.
5. Planned screens (mockups)
The mockups cover scenarios that are required but not visible in the current client:
•	adding photos to a spot and choosing who sees it (screen 3),
•	adding a catch with a photo and a species suggestion with a confidence level and manual correction (screen 4),
•	visibility settings for equipment items (screen 5).
In the species suggestion mockup, confidence is shown in words (high / medium / low), because real values will be defined after the first model measurements (see verification-plan-client-ai.md).
6. Known gaps to fix in the client
•	Some interface labels are shown as technical keys instead of translated text (for example, the map filter and the search field of the anglers screen).
•	Test data in screenshots will be replaced before the next pre-defense.

