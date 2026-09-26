const { Catch } = require('../models');

function create(values) {
  return Catch.create(values);
}

function findBySpotId(spotId) {
  return Catch.findAll({
    where: { spotId },
    order: [['caughtAt', 'DESC']]
  });
}

function findById(id) {
  return Catch.findByPk(id);
}

function update(caughtFish, values) {
  return caughtFish.update(values);
}

function remove(caughtFish) {
  return caughtFish.destroy();
}

module.exports = {
  create,
  findBySpotId,
  findById,
  update,
  remove
};
