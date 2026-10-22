const GeminiAIProvider = require('./gemini.provider');
const RuleBasedAIProvider = require('./rule-based.provider');
const env = require('../config/env');

let activeProvider = null;

function getAIProvider() {
  if (!activeProvider) {
    if (env.geminiApiKey && env.aiProvider !== 'rule-based') {
      activeProvider = new GeminiAIProvider(env.geminiApiKey);
    } else {
      activeProvider = new RuleBasedAIProvider();
    }
  }
  return activeProvider;
}

function setAIProvider(provider) {
  activeProvider = provider;
}

module.exports = {
  getAIProvider,
  setAIProvider,
  GeminiAIProvider,
  RuleBasedAIProvider
};
