'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auth_refresh_tokens', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'auth_users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      token_hash: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      family_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      is_revoked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
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

    await queryInterface.addIndex('auth_refresh_tokens', ['token_hash'], {
      name: 'auth_refresh_tokens_token_hash_unique',
      unique: true
    });

    await queryInterface.addIndex('auth_refresh_tokens', ['user_id'], {
      name: 'auth_refresh_tokens_user_id_idx'
    });

    await queryInterface.addIndex('auth_refresh_tokens', ['family_id'], {
      name: 'auth_refresh_tokens_family_id_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('auth_refresh_tokens');
  }
};
