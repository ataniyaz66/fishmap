'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('inventory_items', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true
    });
    await queryInterface.addColumn('inventory_items', 'weight_grams', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
    await queryInterface.addColumn('inventory_items', 'photo_url', {
      type: Sequelize.STRING(500),
      allowNull: true
    });
    await queryInterface.addColumn('inventory_items', 'notes', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('inventory_items', 'notes');
    await queryInterface.removeColumn('inventory_items', 'photo_url');
    await queryInterface.removeColumn('inventory_items', 'weight_grams');
    await queryInterface.removeColumn('inventory_items', 'color');
  }
};
