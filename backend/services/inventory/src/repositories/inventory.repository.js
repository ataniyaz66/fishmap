const { InventoryItem } = require('../models');

function create(values) {
  return InventoryItem.create(values);
}

function findAllByUserId(userId) {
  return InventoryItem.findAll({
    where: { userId },
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
