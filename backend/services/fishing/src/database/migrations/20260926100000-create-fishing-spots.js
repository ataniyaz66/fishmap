'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fishing_spots', {
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
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      latitude: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      longitude: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      water_type: {
        type: Sequelize.STRING,
        allowNull: true
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

    await queryInterface.addConstraint('fishing_spots', {
      fields: ['latitude'],
      type: 'check',
      where: {
        latitude: {
          [Sequelize.Op.between]: [-90, 90]
        }
      },
      name: 'fishing_spots_latitude_range'
    });

    await queryInterface.addConstraint('fishing_spots', {
      fields: ['longitude'],
      type: 'check',
      where: {
        longitude: {
          [Sequelize.Op.between]: [-180, 180]
        }
      },
      name: 'fishing_spots_longitude_range'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('fishing_spots');
  }
};
