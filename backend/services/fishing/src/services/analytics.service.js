const { Catch, FishingSession, FishingSpot } = require('../models');
const AppError = require('../utils/app-error');

async function getUserAnalytics(userId) {
  if (!userId) {
    throw new AppError('Authenticated user identity required for analytics', 401, 'UNAUTHORIZED');
  }

  const [catches, sessions] = await Promise.all([
    Catch.findAll({
      where: { userId },
      include: [{ model: FishingSpot, as: 'spot' }]
    }),
    FishingSession.findAll({
      where: { userId }
    })
  ]);

  const totalCatches = catches.length;
  const totalSessions = sessions.length;

  let totalWeight = 0;
  let maxWeight = 0;
  let maxLength = 0;

  const speciesMap = {};
  const baitMap = {};
  const spotMap = {};
  const monthlyActivity = {};

  for (const c of catches) {
    // Weight
    if (c.weight !== null && c.weight !== undefined) {
      const w = Number(c.weight);
      if (Number.isFinite(w)) {
        totalWeight += w;
        if (w > maxWeight) maxWeight = w;
      }
    }

    // Length
    if (c.length !== null && c.length !== undefined) {
      const l = Number(c.length);
      if (Number.isFinite(l) && l > maxLength) maxLength = l;
    }

    // Species
    if (c.species) {
      speciesMap[c.species] = (speciesMap[c.species] || 0) + 1;
    }

    // Bait
    if (c.bait) {
      baitMap[c.bait] = (baitMap[c.bait] || 0) + 1;
    }

    // Spot
    if (c.spot && c.spot.name) {
      spotMap[c.spot.name] = (spotMap[c.spot.name] || 0) + 1;
    }

    // Monthly activity
    if (c.caughtAt) {
      const date = new Date(c.caughtAt);
      if (!isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyActivity[key] = (monthlyActivity[key] || 0) + 1;
      }
    }
  }

  // Convert maps to sorted arrays
  const speciesDistribution = Object.entries(speciesMap)
    .map(([species, count]) => ({
      species,
      count,
      percentage: totalCatches > 0 ? Math.round((count / totalCatches) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const topBaits = Object.entries(baitMap)
    .map(([bait, count]) => ({ bait, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topSpots = Object.entries(spotMap)
    .map(([spotName, count]) => ({ spotName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const activityTrend = Object.entries(monthlyActivity)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    overview: {
      totalCatches,
      totalSessions,
      uniqueSpecies: Object.keys(speciesMap).length,
      totalWeight: Math.round(totalWeight * 100) / 100,
      maxWeight: Math.round(maxWeight * 100) / 100,
      maxLength: Math.round(maxLength * 100) / 100
    },
    speciesDistribution,
    topBaits,
    topSpots,
    activityTrend
  };
}

module.exports = {
  getUserAnalytics
};
