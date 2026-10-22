class RuleBasedAIProvider {
  constructor() {
    this.name = 'rule-based-expert-engine';
  }

  async recommendLure({ species, waterType, weather, depthMeters, userInventory = [] }) {
    const rawSpecies = species || 'Bass';
    const targetSpecies = rawSpecies.toLowerCase();
    const depth = Number(depthMeters) || 2.5;
    const isSunny = weather && weather.cloudCoverPercent < 30;
    const isWindy = weather && weather.windSpeedKmh > 15;

    let primaryLure = 'Soft Plastic Swim Bait';
    let lureType = 'soft_plastic';
    let recommendedColors = ['Green Pumpkin', 'Watermelon'];
    let retrieveStyle = 'Steady retrieve with slight pauses near structure';
    let depthRange = `${Math.max(0.5, depth - 1)}m - ${depth + 1}m`;
    let confidence = 0.88;
    let tips = [];

    if (targetSpecies.includes('pike')) {
      primaryLure = isSunny ? 'Silver Spoon (20-30g)' : 'Firetiger Jerkbait (13cm)';
      lureType = 'spoon';
      recommendedColors = isSunny ? ['Silver', 'Nickel', 'Blue/Chrome'] : ['Firetiger', 'Gold/Orange', 'Chartreuse'];
      retrieveStyle = 'Erratic twitch-and-pause; pike often strike during the dying flutter';
      tips.push('Always use a titanium or fluorocarbon leader (minimum 30lb) to prevent bite-offs.');
      tips.push('Target weed edges and drop-offs where ambush predators wait.');
    } else if (targetSpecies.includes('walleye') || targetSpecies.includes('zander')) {
      primaryLure = 'Jig Head (10-15g) with Chartreuse Paddle Tail';
      lureType = 'jig';
      recommendedColors = ['Chartreuse', 'Pearl White', 'Lime'];
      retrieveStyle = 'Bottom hopping: lift rod tip 30-50cm and let lure glide back to bottom on semi-slack line';
      depthRange = `${Math.max(2, depth)}m - ${depth + 3}m`;
      tips.push('Walleye have sensitive low-light eyes; dawn, dusk, and overcast periods are peak windows.');
      tips.push('Maintain bottom contact; 90% of walleye bites happen on the drop.');
    } else if (targetSpecies.includes('trout')) {
      primaryLure = 'Inline Spinner (#2 Gold Blade) or Micro Spoon (3.5g)';
      lureType = 'spinner';
      recommendedColors = ['Gold/Red Dots', 'Copper', 'Rainbow Trout Pattern'];
      retrieveStyle = 'Slow steady retrieve just fast enough to keep the blade thumping against the current';
      depthRange = '0.5m - 2.0m';
      tips.push('Use light monofilament or fluorocarbon (4-6lb) for invisible presentation.');
      tips.push('Cast upstream and retrieve slightly faster than current velocity.');
    } else if (targetSpecies.includes('bass')) {
      if (depth < 2) {
        primaryLure = isWindy ? 'White Spinnerbait with Willow Blades' : 'Weightless Texas-Rigged Stick Worm (5-inch)';
        lureType = isWindy ? 'spinnerbait' : 'soft_plastic';
        recommendedColors = isSunny ? ['Watermelon Red', 'Green Pumpkin'] : ['Black and Blue', 'Junebug'];
        retrieveStyle = 'Deadsticking: let lure settle, twitch twice, pause 4-5 seconds';
      } else {
        primaryLure = 'Medium Diving Crankbait (8-12ft dive depth)';
        lureType = 'crankbait';
        recommendedColors = ['Shad', 'Bluegill Pattern', 'Chartreuse Belly'];
        retrieveStyle = 'Deflection retrieve: deliberately bounce off underwater rocks or timber';
      }
      tips.push('Watch line for sudden movement or twitches during the sinking phase.');
    } else if (targetSpecies.includes('perch')) {
      primaryLure = '2-inch Minnow Soft Plastic on 3.5g Tungsten Jig';
      lureType = 'jig';
      recommendedColors = ['Motor Oil', 'Brown/Gold Flake', 'UV Pearl'];
      retrieveStyle = 'Gentle short hops along the bottom edge of weedbeds';
      tips.push('Perch hunt in schools; once you catch one, cast immediately back to the same spot.');
    }

    if (weather && weather.pressureHpa && weather.pressureHpa < 1005) {
      tips.push('Low atmospheric pressure detected: downsize your lure and slow down retrieve cadence.');
      confidence = Math.max(0.75, confidence - 0.05);
    }

    // Match against user inventory if provided
    const matchingInventory = [];
    if (Array.isArray(userInventory) && userInventory.length > 0) {
      for (const item of userInventory) {
        const itemType = (item.type || '').toLowerCase();
        const itemName = (item.name || '').toLowerCase();
        const itemColor = (item.color || '').toLowerCase();

        let matchScore = 0;
        if (itemType === lureType || itemName.includes(lureType)) matchScore += 2;
        if (recommendedColors.some((c) => itemColor.includes(c.toLowerCase()) || itemName.includes(c.toLowerCase()))) {
          matchScore += 1;
        }

        if (matchScore > 0) {
          matchingInventory.push({
            id: item.id,
            name: item.name,
            type: item.type,
            color: item.color,
            brand: item.brand,
            matchQuality: matchScore >= 3 ? 'High' : 'Moderate'
          });
        }
      }
    }

    return {
      provider: this.name,
      targetSpecies: rawSpecies,
      primaryLure,
      lureType,
      recommendedColors,
      retrieveStyle,
      depthRange,
      confidenceScore: confidence,
      expertTips: tips,
      matchingInventory
    };
  }

  async assist({ query, conversationHistory = [] }) {
    const q = (query || '').toLowerCase();

    let reply = '';
    const suggestedFollowUps = [];

    if (q.includes('pike') || q.includes('autumn') || q.includes('fall')) {
      reply = `In autumn, northern pike transition into aggressive feeding mode as water temperatures drop below 15°C (60°F) to prepare for winter.

### Strategic Tactics:
1. **Location**: Target remaining green weedlines, drop-offs into 4-8m depths, and secondary points where forage fish school.
2. **Lure Size**: Upsize your presentations (15-20cm swimbaits, large spoons, heavy jerkbaits).
3. **Retrieve**: Steady retrieves with extended pauses near structure. Pike are cold-blooded; the pause gives them time to align strikes.
4. **Safety Gear**: Use heavy wire or 40lb+ fluorocarbon leaders and keep long-nose pliers handy for hook removal.`;
      suggestedFollowUps.push('What leader material is best for pike?');
      suggestedFollowUps.push('Which colors work best in stained autumn water?');
    } else if (q.includes('knot') || q.includes('line')) {
      reply = `### Recommended Fishing Knots:
- **Palomar Knot**: Exceptional for braid to hook/swivel. Over 95% knot strength, simple to tie.
- **FG Knot**: The ultimate slim knot for joining braided mainline to fluorocarbon leader without guide chatter.
- **Non-Slip Loop Knot**: Essential for crankbaits, jerkbaits, and jigs to allow natural wobble and free articulation.`;
      suggestedFollowUps.push('How do I tie an FG knot quickly?');
      suggestedFollowUps.push('What fluorocarbon pound test should I use?');
    } else {
      reply = `FishMap Intelligent Assistant:
For effective angling, always assess three core variables before selecting tactics:
1. **Water Temperature & Season**: Dictates fish metabolism and depth strata.
2. **Barometric Pressure**: Rising/stable barometer stimulates feeding; steep drops push fish deep.
3. **Water Clarity**: In clear water, use natural translucent colors (Green Pumpkin, Smoke); in dark/muddy water, use high-contrast vibrations and bright hues (Chartreuse, Black/Blue).`;
      suggestedFollowUps.push('Recommend a lure for my current spot');
      suggestedFollowUps.push('How does barometric pressure affect fish?');
    }

    return {
      provider: this.name,
      reply,
      suggestedFollowUps,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = RuleBasedAIProvider;
