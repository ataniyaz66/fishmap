module.exports = (sequelize, DataTypes) => sequelize.define(
  'SpotFavorite',
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
    }
  },
  {
    tableName: 'spot_favorites',
    underscored: true
  }
);
