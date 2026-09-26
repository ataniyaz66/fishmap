const catchesRepository = require('../repositories/catches.repository');
const spotsService = require('./spots.service');
const AppError = require('../utils/app-error');

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const catchFields = [
  'user_id',
  'species',
  'weight',
  'length',
  'bait',
  'notes',
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
    ['caught_at', 'caughtAt']
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
}

async function create(spotId, body) {
  validateUuid(spotId, 'spotId');
  const values = pickFields(body, catchFields);
  validateUuid(values.user_id, 'user_id');
  validateCatch(values, true);
  await spotsService.getById(spotId);
  return catchesRepository.create({
    ...toModelValues(values),
    spotId
  });
}

async function listBySpotId(spotId) {
  validateUuid(spotId, 'spotId');
  await spotsService.getById(spotId);
  return catchesRepository.findBySpotId(spotId);
}

async function getById(id) {
  validateUuid(id, 'id');
  const caughtFish = await catchesRepository.findById(id);
  if (!caughtFish) {
    throw new AppError('Catch not found', 404);
  }
  return caughtFish;
}

async function update(id, body) {
  const caughtFish = await getById(id);
  const values = pickFields(body, updateFields);
  if (Object.keys(values).length === 0) {
    throw new AppError('At least one updatable field is required', 400);
  }
  validateCatch(values, false);
  return catchesRepository.update(caughtFish, toModelValues(values));
}

async function remove(id) {
  const caughtFish = await getById(id);
  await catchesRepository.remove(caughtFish);
}

module.exports = {
  create,
  listBySpotId,
  getById,
  update,
  remove
};
