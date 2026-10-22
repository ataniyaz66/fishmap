module.exports = (sequelize, DataTypes) => sequelize.define(
  'FishingSpot',
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    waterType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'water_type'
    },
    region: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    visibility: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'public',
      validate: {
        isIn: [['public', 'friends', 'private']]
      }
    }
  },
  {
    tableName: 'fishing_spots',
    underscored: true
  }
);
