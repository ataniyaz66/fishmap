'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add visibility and region to fishing_spots if not exist
    await queryInterface.addColumn('fishing_spots', 'visibility', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'public'
    });

    await queryInterface.addColumn('fishing_spots', 'region', {
      type: Sequelize.STRING(150),
      allowNull: true
    });

    // 2. Create fishing_sessions
    await queryInterface.createTable('fishing_sessions', {
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
      title: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      water_conditions: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      weather_summary: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addIndex('fishing_sessions', ['user_id']);

    // 3. Add session_id, visibility, and photo_urls to catches
    await queryInterface.addColumn('catches', 'session_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'fishing_sessions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('catches', 'visibility', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'public'
    });

    await queryInterface.addColumn('catches', 'photo_urls', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    // 4. Create spot_favorites
    await queryInterface.createTable('spot_favorites', {
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
      spot_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'fishing_spots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addIndex('spot_favorites', ['user_id', 'spot_id'], {
      unique: true,
      name: 'spot_favorites_user_spot_unique'
    });

    // 5. Create spot_reports
    await queryInterface.createTable('spot_reports', {
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
      spot_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'fishing_spots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      reason: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'pending'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spot_reports');
    await queryInterface.dropTable('spot_favorites');
    await queryInterface.removeColumn('catches', 'photo_urls');
    await queryInterface.removeColumn('catches', 'visibility');
    await queryInterface.removeColumn('catches', 'session_id');
    await queryInterface.dropTable('fishing_sessions');
    await queryInterface.removeColumn('fishing_spots', 'region');
    await queryInterface.removeColumn('fishing_spots', 'visibility');
  }
};
