'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_profiles', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      auth_user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true
      },
      display_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      avatar_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    await queryInterface.addIndex('user_profiles', ['auth_user_id'], {
      name: 'user_profiles_auth_user_id_unique',
      unique: true
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_profiles');
  }
};
