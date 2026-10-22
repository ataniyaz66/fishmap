const RuleBasedAIProvider = require('./rule-based.provider');

class GeminiAIProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.fallback = new RuleBasedAIProvider();
    this.name = 'gemini-1.5-flash';
  }

  async recommendLure(params) {
    if (!this.apiKey) {
      return this.fallback.recommendLure(params);
    }

    try {
      const prompt = `You are the lead ichthyologist and master fishing guide for FishMap.
Recommend the optimal lure for an angler with the following conditions:
Species: ${params.species || 'Bass'}
Water Type: ${params.waterType || 'Lake'}
Depth: ${params.depthMeters || 2} meters
Weather: ${JSON.stringify(params.weather || {})}

Return a valid JSON object with keys:
"primaryLure", "lureType", "recommendedColors" (array of strings), "retrieveStyle", "depthRange", "confidenceScore" (float 0-1), "expertTips" (array of strings). Do not include markdown code fences.`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Gemini API returned status ${res.status}`);
      }

      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty Gemini response');

      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        provider: this.name,
        targetSpecies: params.species,
        ...parsed,
        matchingInventory: []
      };
    } catch (err) {
      return this.fallback.recommendLure(params);
    }
  }

  async assist(params) {
    if (!this.apiKey) {
      return this.fallback.assist(params);
    }

    try {
      const prompt = `You are FishMap AI, an expert angling assistant. Provide clear, practical, structured advice to:
"${params.query}"`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Gemini API returned status ${res.status}`);
      }

      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty Gemini response');

      return {
        provider: this.name,
        reply: text,
        suggestedFollowUps: ['What colors work best in current conditions?', 'Recommend a retrieve cadence'],
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return this.fallback.assist(params);
    }
  }
}

module.exports = GeminiAIProvider;
