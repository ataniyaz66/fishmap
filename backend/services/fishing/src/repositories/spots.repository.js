const { FishingSpot } = require('../models');

function create(values) {
  return FishingSpot.create(values);
}

function findAll() {
  return FishingSpot.findAll({ order: [['createdAt', 'DESC']] });
}

function findById(id) {
  return FishingSpot.findByPk(id);
}

function update(spot, values) {
  return spot.update(values);
}

function remove(spot) {
  return spot.destroy();
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
