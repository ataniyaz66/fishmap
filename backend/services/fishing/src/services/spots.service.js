const spotsRepository = require('../repositories/spots.repository');
const AppError = require('../utils/app-error');

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const spotFields = [
  'user_id',
  'name',
  'description',
  'latitude',
  'longitude',
  'water_type'
];

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

function validateCoordinate(value, field, min, max, required) {
  if (value === undefined || value === null) {
    if (required) {
      throw new AppError(`${field} is required`, 400);
    }
    return;
  }

  if (
    (typeof value !== 'number' && typeof value !== 'string') ||
    String(value).trim() === '' ||
    !Number.isFinite(Number(value)) ||
    Number(value) < min ||
    Number(value) > max
  ) {
    throw new AppError(`${field} must be a number between ${min} and ${max}`, 400);
  }
}

function pickFields(body, allowedFields) {
  return Object.fromEntries(
    allowedFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]])
  );
}

function validateSpot(values, creating) {
  validateString(values.name, 'name', creating, 120);
  validateCoordinate(values.latitude, 'latitude', -90, 90, creating);
  validateCoordinate(values.longitude, 'longitude', -180, 180, creating);
  validateString(values.description, 'description', false, 10000);
  validateString(values.water_type, 'water_type', false, 120);
}

function toModelValues(values) {
  const mapped = { ...values };
  if (Object.prototype.hasOwnProperty.call(mapped, 'user_id')) {
    mapped.userId = mapped.user_id;
    delete mapped.user_id;
  }
  if (Object.prototype.hasOwnProperty.call(mapped, 'water_type')) {
    mapped.waterType = mapped.water_type;
    delete mapped.water_type;
  }
  return mapped;
}

async function create(body) {
  const values = pickFields(body, spotFields);
  validateUuid(values.user_id, 'user_id');
  validateSpot(values, true);
  return spotsRepository.create(toModelValues(values));
}

function list() {
  return spotsRepository.findAll();
}

async function getById(id) {
  validateUuid(id, 'id');
  const spot = await spotsRepository.findById(id);
  if (!spot) {
    throw new AppError('Fishing spot not found', 404);
  }
  return spot;
}

async function update(id, body) {
  const spot = await getById(id);
  const values = pickFields(body, spotFields.filter((field) => field !== 'user_id'));
  if (Object.keys(values).length === 0) {
    throw new AppError('At least one updatable field is required', 400);
  }
  validateSpot(values, false);
  return spotsRepository.update(spot, toModelValues(values));
}

async function remove(id) {
  const spot = await getById(id);
  await spotsRepository.remove(spot);
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove
};
