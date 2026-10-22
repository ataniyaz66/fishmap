module.exports = (sequelize, DataTypes) => sequelize.define(
  'FishingSession',
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
    title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'started_at'
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'ended_at'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    waterConditions: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'water_conditions'
    },
    weatherSummary: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'weather_summary'
    }
  },
  {
    tableName: 'fishing_sessions',
    underscored: true
  }
);
