module.exports = (sequelize, DataTypes) => sequelize.define(
  'InventoryItem',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 120]
      }
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    weightGrams: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'weight_grams'
    },
    photoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'photo_url'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    visibility: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'private',
      validate: {
        isIn: [['private', 'friends', 'public']]
      }
    }
  },
  {
    tableName: 'inventory_items',
    underscored: true
  }
);
