module.exports = (sequelize, DataTypes) => sequelize.define(
  'Catch',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    spotId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'spot_id',
      references: {
        model: 'fishing_spots',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },
    species: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 120]
      }
    },
    weight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    length: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    bait: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    caughtAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'caught_at'
    }
  },
  {
    tableName: 'catches',
    underscored: true
  }
);
