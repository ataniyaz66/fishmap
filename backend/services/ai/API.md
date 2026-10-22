# FishMap AI Service API Specification

The AI Service provides intelligent, weather-aware lure recommendations and angling assistance. It operates in dual-provider mode: using Google Gemini 1.5 Flash when an API key is present, and an offline ichthyology rule-based expert engine when operating without credentials or offline.

## Base URL
Through Gateway: `/api/v1/ai`
Direct Service: `http://localhost:4008/api/v1/ai`

## Endpoints

### 1. Lure Recommendation
- `POST /recommend-lure`
  - Body:
    ```json
    {
      "species": "Northern Pike",
      "water_type": "lake",
      "depth_meters": 2.5,
      "weather": {
        "temperatureC": 14.2,
        "pressureHpa": 1014.0,
        "windSpeedKmh": 12.0,
        "cloudCoverPercent": 60
      },
      "user_inventory": [
        { "id": "...", "name": "Williams Wabler Spoon", "type": "spoon", "color": "Silver" }
      ]
    }
    ```
  - Returns:
    - `provider`: active engine name
    - `targetSpecies`, `primaryLure`, `lureType`, `recommendedColors`, `retrieveStyle`, `depthRange`, `confidenceScore`, `expertTips`
    - `matchingInventory`: array of user inventory items matching the recommended lure type and colors.

### 2. Angling Assistant
- `POST /assist`
  - Body: `{ "query": "What leader should I use for pike fishing?" }`
  - Returns: `{ "provider": string, "reply": string, "suggestedFollowUps": string[] }`

### 3. Service Status
- `GET /status`
  - Returns active provider and capabilities.
