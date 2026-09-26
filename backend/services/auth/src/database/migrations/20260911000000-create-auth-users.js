'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auth_users', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(320),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      account_status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'active',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('auth_users', [Sequelize.fn('LOWER', Sequelize.col('email'))], {
      name: 'auth_users_email_lower_unique',
      unique: true,
    });
    await queryInterface.addIndex('auth_users', [Sequelize.fn('LOWER', Sequelize.col('username'))], {
      name: 'auth_users_username_lower_unique',
      unique: true,
    });
    await queryInterface.addIndex('auth_users', ['account_status'], {
      name: 'auth_users_account_status_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('auth_users');
  },
};
