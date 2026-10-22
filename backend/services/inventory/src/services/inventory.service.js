const inventoryRepository = require('../repositories/inventory.repository');
const AppError = require('../utils/app-error');

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const createFields = [
  'name',
  'type',
  'quantity',
  'description',
  'brand',
  'color',
  'weight_grams',
  'weightGrams',
  'photo_url',
  'photoUrl',
  'notes',
  'visibility'
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

function validateOptionalText(value, field) {
  if (value !== undefined && value !== null && typeof value !== 'string') {
    throw new AppError(`${field} must be a string`, 400);
  }
}

function validateQuantity(value, required) {
  if (value === undefined || value === null) {
    if (required) {
      throw new AppError('quantity is required', 400);
    }
    return;
  }

  if (!Number.isInteger(value) || value < 0) {
    throw new AppError('quantity must be an integer greater than or equal to 0', 400);
  }
}

function validateVisibility(value, required) {
  if (value === undefined || value === null) {
    if (required) {
      throw new AppError('visibility is required', 400);
    }
    return;
  }

  if (!['private', 'friends', 'public'].includes(value)) {
    throw new AppError('visibility must be private, friends, or public', 400);
  }
}

function validateFields(values, creating) {
  validateString(values.name, 'name', creating, 120);
  validateString(values.type, 'type', creating, 50);
  validateQuantity(values.quantity, false);
  validateOptionalText(values.description, 'description');
  validateString(values.brand, 'brand', false, 100);
  validateString(values.color, 'color', false, 50);
  validateOptionalText(values.notes, 'notes');
  validateVisibility(values.visibility, false);

  const weight = values.weight_grams !== undefined ? values.weight_grams : values.weightGrams;
  if (weight !== undefined && weight !== null && (!Number.isFinite(Number(weight)) || Number(weight) < 0)) {
    throw new AppError('weight_grams must be a positive number', 400);
  }
}

function validateBody(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('Request body must be a JSON object', 400);
  }
}

function pickFields(body) {
  return Object.fromEntries(
    createFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]])
  );
}

function toModelValues(values) {
  const mapped = { ...values };
  if (Object.prototype.hasOwnProperty.call(mapped, 'weight_grams')) {
    mapped.weightGrams = mapped.weight_grams;
    delete mapped.weight_grams;
  }
  if (Object.prototype.hasOwnProperty.call(mapped, 'photo_url')) {
    mapped.photoUrl = mapped.photo_url;
    delete mapped.photo_url;
  }
  return mapped;
}

async function findOwnedItem(id, userId) {
  validateUuid(id, 'id');
  if (userId) {
    validateUuid(userId, 'user_id');
  }

  const item = await inventoryRepository.findById(id);
  if (!item) {
    throw new AppError('Inventory item not found', 404);
  }

  if (userId && item.userId.toLowerCase() !== userId.toLowerCase()) {
    throw new AppError('Inventory item not found', 404);
  }

  return item;
}

async function createItem(userId, body) {
  validateBody(body);
  const targetUserId = userId || body.user_id || body.userId;
  validateUuid(targetUserId, 'user_id');
  const values = pickFields(body);
  validateFields(values, true);
  return inventoryRepository.create({
    ...toModelValues(values),
    userId: targetUserId,
    quantity: values.quantity === undefined ? 0 : values.quantity,
    visibility: values.visibility === undefined ? 'private' : values.visibility
  });
}

async function listItems(targetUserId, requestingUserId = null, queryParams = {}) {
  const effectiveUserId = targetUserId || requestingUserId;
  validateUuid(effectiveUserId, 'user_id');

  const options = {};
  if (queryParams.type) {
    options.type = queryParams.type;
  }

  // If viewing someone else's inventory, filter out private items
  if (requestingUserId && requestingUserId.toLowerCase() !== effectiveUserId.toLowerCase()) {
    options.allowedVisibilities = ['friends', 'public'];
  }

  return inventoryRepository.findAllByUserId(effectiveUserId, options);
}

async function getItem(id, requestingUserId = null) {
  validateUuid(id, 'id');
  const item = await inventoryRepository.findById(id);
  if (!item) {
    throw new AppError('Inventory item not found', 404);
  }

  if (requestingUserId && item.userId.toLowerCase() !== requestingUserId.toLowerCase()) {
    if (item.visibility === 'private') {
      throw new AppError('Inventory item not found', 404);
    }
  }

  return item;
}

async function updateItem(id, userId, body) {
  const item = await findOwnedItem(id, userId);
  validateBody(body);
  const values = pickFields(body);

  if (Object.keys(values).length === 0) {
    throw new AppError('At least one updatable field is required', 400);
  }

  validateFields(values, false);
  return inventoryRepository.update(item, toModelValues(values));
}

async function deleteItem(id, userId) {
  const item = await findOwnedItem(id, userId);
  await inventoryRepository.delete(item);
}

module.exports = {
  createItem,
  listItems,
  getItem,
  updateItem,
  deleteItem
};
