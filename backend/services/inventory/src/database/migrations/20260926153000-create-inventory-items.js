'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_items', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(120),
        allowNull: false
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      brand: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      visibility: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'private'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addConstraint('inventory_items', {
      fields: ['quantity'],
      type: 'check',
      where: {
        quantity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'inventory_items_quantity_nonnegative'
    });

    await queryInterface.addConstraint('inventory_items', {
      fields: ['visibility'],
      type: 'check',
      where: {
        visibility: {
          [Sequelize.Op.in]: ['private', 'friends']
        }
      },
      name: 'inventory_items_visibility_allowed'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inventory_items');
  }
};
