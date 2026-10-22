const { InventoryItem } = require('../models');
const { Op } = require('sequelize');

function create(values) {
  return InventoryItem.create(values);
}

function findAllByUserId(userId, options = {}) {
  const where = { userId };
  if (options.allowedVisibilities) {
    where.visibility = { [Op.in]: options.allowedVisibilities };
  }
  if (options.type) {
    where.type = options.type;
  }
  return InventoryItem.findAll({
    where,
    limit: Math.min(Math.max(Number(options.limit) || 100, 1), 200),
    offset: Math.max(Number(options.offset) || 0, 0),
    order: [['createdAt', 'DESC']]
  });
}

function findById(id) {
  return InventoryItem.findByPk(id);
}

function update(item, values) {
  return item.update(values);
}

function remove(item) {
  return item.destroy();
}

module.exports = {
  create,
  findAllByUserId,
  findById,
  update,
  delete: remove
};
