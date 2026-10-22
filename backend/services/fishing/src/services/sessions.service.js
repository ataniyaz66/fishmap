const sessionsRepository = require('../repositories/sessions.repository');
const AppError = require('../utils/app-error');

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUuid(value, field) {
  if (typeof value !== 'string' || !uuidPattern.test(value)) {
    throw new AppError(`${field} must be a valid UUID`, 400);
  }
}

async function createSession(userId, body) {
  validateUuid(userId, 'userId');
  if (!body || !body.title || typeof body.title !== 'string') {
    throw new AppError('title is required', 400, 'VALIDATION_ERROR');
  }

  const startedAt = body.started_at || body.startedAt || new Date().toISOString();

  return sessionsRepository.create({
    userId,
    title: body.title.trim(),
    startedAt,
    endedAt: body.ended_at || body.endedAt || null,
    notes: body.notes || null,
    waterConditions: body.water_conditions || body.waterConditions || null,
    weatherSummary: body.weather_summary || body.weatherSummary || null
  });
}

async function getSessionById(id, requestingUserId) {
  validateUuid(id, 'id');
  const session = await sessionsRepository.findById(id);
  if (!session) {
    throw new AppError('Fishing session not found', 404, 'NOT_FOUND');
  }

  if (session.userId !== requestingUserId) {
    throw new AppError('You do not have access to this fishing session', 403, 'FORBIDDEN');
  }

  return session;
}

async function listSessions(userId, limit, offset) {
  validateUuid(userId, 'userId');
  return sessionsRepository.findByUserId(userId, limit, offset);
}

async function updateSession(id, userId, body) {
  const session = await getSessionById(id, userId);

  const updates = {};
  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.ended_at !== undefined || body.endedAt !== undefined) {
    updates.endedAt = body.ended_at || body.endedAt;
  }
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.water_conditions !== undefined || body.waterConditions !== undefined) {
    updates.waterConditions = body.water_conditions || body.waterConditions;
  }
  if (body.weather_summary !== undefined || body.weatherSummary !== undefined) {
    updates.weatherSummary = body.weather_summary || body.weatherSummary;
  }

  return sessionsRepository.update(session, updates);
}

async function deleteSession(id, userId) {
  const session = await getSessionById(id, userId);
  await sessionsRepository.remove(session);
}

module.exports = {
  createSession,
  getSessionById,
  listSessions,
  updateSession,
  deleteSession
};
