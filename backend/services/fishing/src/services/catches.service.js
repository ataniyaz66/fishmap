const catchesRepository = require('../repositories/catches.repository');
const spotsService = require('./spots.service');
const AppError = require('../utils/app-error');

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const catchFields = [
  'spot_id',
  'session_id',
  'species',
  'weight',
  'length',
  'bait',
  'notes',
  'photo_urls',
  'visibility',
  'caught_at'
];
const updateFields = catchFields.filter((field) => field !== 'user_id');

function validateUuid(value, field) {
  if (typeof value !== 'string' || !uuidPattern.test(value)) {
    throw new AppError(`${field} must be a valid UUID`, 400);
  }
}

function validateString(value, field, required, maxLength) {
  if (value === undefined || value === null) {
    if (required) {
      throw new AppError(`${field} is required`, 400);
    }
    return;
  }

  if (typeof value !== 'string' || (required && value.trim().length === 0)) {
    throw new AppError(`${field} must be a non-empty string`, 400);
  }

  if (value.length > maxLength) {
    throw new AppError(`${field} must be at most ${maxLength} characters`, 400);
  }
}

function validateNonNegativeNumber(value, field) {
  if (value === undefined || value === null) {
    return;
  }
  if (
    (typeof value !== 'number' && typeof value !== 'string') ||
    String(value).trim() === '' ||
    !Number.isFinite(Number(value)) ||
    Number(value) < 0
  ) {
    throw new AppError(`${field} must be a non-negative number`, 400);
  }
}

function validateDate(value, field, required) {
  if (value === undefined || value === null) {
    if (required) {
      throw new AppError(`${field} is required`, 400);
    }
    return;
  }

  if (
    typeof value !== 'string' ||
    value.trim() === '' ||
    !Number.isFinite(Date.parse(value))
  ) {
    throw new AppError(`${field} must be a valid date`, 400);
  }
}

function validateVisibility(value) {
  if (value !== undefined && value !== null) {
    if (!['public', 'friends', 'private'].includes(value)) {
      throw new AppError('visibility must be public, friends, or private', 400);
    }
  }
}

function pickFields(body, allowedFields) {
  return Object.fromEntries(
    allowedFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]])
  );
}

function toModelValues(values) {
  const mapped = { ...values };
  for (const [requestField, modelField] of [
    ['user_id', 'userId'],
    ['spot_id', 'spotId'],
    ['session_id', 'sessionId'],
    ['caught_at', 'caughtAt'],
    ['photo_urls', 'photoUrls']
  ]) {
    if (Object.prototype.hasOwnProperty.call(mapped, requestField)) {
      mapped[modelField] = mapped[requestField];
      delete mapped[requestField];
    }
  }
  return mapped;
}

function validateCatch(values, creating) {
  validateString(values.species, 'species', creating, 120);
  validateString(values.bait, 'bait', false, 120);
  validateString(values.notes, 'notes', false, 10000);
  validateNonNegativeNumber(values.weight, 'weight');
  validateNonNegativeNumber(values.length, 'length');
  validateDate(values.caught_at, 'caught_at', creating);
  validateVisibility(values.visibility);
}

async function create(userId, body, optionalSpotId = null) {
  validateUuid(userId, 'userId');
  const values = pickFields(body, catchFields);

  if (!values.caught_at) {
    values.caught_at = new Date().toISOString();
  }

  const spotId = optionalSpotId || body.spot_id || body.spotId || null;
  if (spotId) {
    validateUuid(spotId, 'spotId');
    await spotsService.getById(spotId, userId);
  }

  const sessionId = body.session_id || body.sessionId || null;
  if (sessionId) {
    validateUuid(sessionId, 'sessionId');
  }

  validateCatch(values, true);

  return catchesRepository.create({
    ...toModelValues(values),
    userId,
    spotId,
    sessionId,
    visibility: values.visibility || 'public',
    photoUrls: Array.isArray(body.photo_urls || body.photoUrls) ? (body.photo_urls || body.photoUrls) : []
  });
}

async function listBySpotId(spotId, requestingUserId = null) {
  validateUuid(spotId, 'spotId');
  await spotsService.getById(spotId, requestingUserId);
  return catchesRepository.findBySpotId(spotId, { requestingUserId });
}

async function listCatches(queryParams = {}, requestingUserId = null) {
  return catchesRepository.findCatches({
    userId: queryParams.user_id,
    spotId: queryParams.spot_id,
    sessionId: queryParams.session_id,
    species: queryParams.species,
    startDate: queryParams.start_date,
    endDate: queryParams.end_date,
    requestingUserId,
    limit: queryParams.limit,
    offset: queryParams.offset
  });
}

async function getById(id, requestingUserId = null) {
  validateUuid(id, 'id');
  const caughtFish = await catchesRepository.findById(id);
  if (!caughtFish) {
    throw new AppError('Catch not found', 404);
  }

  if (caughtFish.visibility === 'private' && (!requestingUserId || caughtFish.userId !== requestingUserId)) {
    throw new AppError('Catch not found', 404);
  }

  return caughtFish;
}

async function update(id, userId, body) {
  const caughtFish = await getById(id, userId);

  // Ownership check
  if (caughtFish.userId !== userId) {
    throw new AppError('You are not authorized to modify this catch record', 403, 'FORBIDDEN');
  }

  const values = pickFields(body, updateFields);
  if (Object.keys(values).length === 0) {
    throw new AppError('At least one updatable field is required', 400);
  }

  validateCatch(values, false);
  return catchesRepository.update(caughtFish, toModelValues(values));
}

async function remove(id, userId) {
  const caughtFish = await getById(id, userId);

  if (caughtFish.userId !== userId) {
    throw new AppError('You are not authorized to delete this catch record', 403, 'FORBIDDEN');
  }

  await catchesRepository.remove(caughtFish);
}

module.exports = {
  create,
  listBySpotId,
  listCatches,
  getById,
  update,
  remove
};
