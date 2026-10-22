# FishMap Weather Service API Specification

The Weather Service provides real-time atmospheric and water conditions, multi-day forecasts, and a calculated Fishing Suitability Index based on barometric pressure stability, wind chop, and temperature.

## Base URL
Through Gateway: `/api/v1/weather`
Direct Service: `http://localhost:4007/api/v1/weather`

## Endpoints

### 1. Current Weather & Fishing Suitability
- `GET /current`
  - Query: `lat` (latitude, -90 to 90), `lng` (longitude, -180 to 180)
  - Returns:
    - `source`: `'open-meteo'` (live) or `'mock'` (fallback)
    - `temperatureC`, `temperatureF`, `pressureHpa`, `humidityPercent`, `windSpeedKmh`, `windDirectionDeg`, `cloudCoverPercent`, `conditions`
    - `fishingSuitability`: `{ "score": 1-10, "rating": "Excellent"|"Good"|"Fair"|"Challenging", "recommendations": string[] }`
  - Caching: In-memory grid cache with 30-minute TTL per 0.01-degree (~1.1 km) cell.

### 2. Multi-Day Forecast
- `GET /forecast`
  - Query: `lat`, `lng`, `days` (default 3, max 7)
  - Returns array of forecast days with `tempMaxC`, `tempMinC`, `pressureHpa`, `windSpeedKmh`, `precipitationProbabilityPercent`, `conditions`.
