module.exports = (sequelize, DataTypes) => sequelize.define(
  'SpotReport',
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
    spotId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'spot_id',
      references: {
        model: 'fishing_spots',
        key: 'id'
      }
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending'
    }
  },
  {
    tableName: 'spot_reports',
    underscored: true
  }
);
