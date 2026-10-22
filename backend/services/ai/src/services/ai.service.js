const { getAIProvider } = require('../providers');
const AppError = require('../utils/app-error');

async function recommendLure(body) {
  if (!body || typeof body !== 'object') {
    throw new AppError('Request body must be a valid JSON object', 400);
  }

  const species = body.species || 'bass';
  const waterType = body.water_type || body.waterType || 'lake';
  const depthMeters = body.depth_meters || body.depthMeters || 2.0;
  const weather = body.weather || null;
  const userInventory = body.user_inventory || body.userInventory || [];

  const provider = getAIProvider();
  return provider.recommendLure({
    species,
    waterType,
    depthMeters,
    weather,
    userInventory
  });
}

async function assist(body) {
  if (!body || !body.query || typeof body.query !== 'string' || body.query.trim().length === 0) {
    throw new AppError('query is required for AI assistance', 400);
  }

  const provider = getAIProvider();
  return provider.assist({
    query: body.query.trim(),
    conversationHistory: body.conversation_history || body.conversationHistory || []
  });
}

async function getStatus() {
  const provider = getAIProvider();
  return {
    status: 'operational',
    activeProvider: provider.name || 'expert-engine',
    capabilities: [
      'lure_recommendation',
      'weather_aware_tactics',
      'inventory_matching',
      'angling_chat_assistant'
    ]
  };
}

module.exports = {
  recommendLure,
  assist,
  getStatus
};
