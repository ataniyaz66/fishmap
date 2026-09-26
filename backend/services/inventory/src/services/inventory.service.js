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

  if (value !== 'private' && value !== 'friends') {
    throw new AppError('visibility must be private or friends', 400);
  }
}

function validateFields(values, creating) {
  validateString(values.name, 'name', creating, 120);
  validateString(values.type, 'type', creating, 50);
  validateQuantity(values.quantity, false);
  validateOptionalText(values.description, 'description');
  validateString(values.brand, 'brand', false, 100);
  validateVisibility(values.visibility, false);
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

async function findOwnedItem(id, userId) {
  validateUuid(id, 'id');
  validateUuid(userId, 'user_id');

  const item = await inventoryRepository.findById(id);
  if (!item || item.userId.toLowerCase() !== userId.toLowerCase()) {
    throw new AppError('Inventory item not found', 404);
  }
  return item;
}

async function createItem(body) {
  validateBody(body);
  validateUuid(body.user_id, 'user_id');
  const values = pickFields(body);
  validateFields(values, true);
  return inventoryRepository.create({
    ...values,
    userId: body.user_id,
    quantity: values.quantity === undefined ? 0 : values.quantity,
    visibility: values.visibility === undefined ? 'private' : values.visibility
  });
}

async function listItems(userId) {
  validateUuid(userId, 'user_id');
  return inventoryRepository.findAllByUserId(userId);
}

async function getItem(id, userId) {
  return findOwnedItem(id, userId);
}

async function updateItem(id, userId, body) {
  const item = await findOwnedItem(id, userId);
  validateBody(body);
  const values = pickFields(body);

  if (Object.keys(values).length === 0) {
    throw new AppError('At least one updatable field is required', 400);
  }

  validateFields(values, false);
  return inventoryRepository.update(item, values);
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
