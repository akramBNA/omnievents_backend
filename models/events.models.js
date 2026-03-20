const { Sequelize, DataTypes } = require("sequelize");

const useNeon = process.env.DB_PROVIDER === 'neon';
const { sequelize } = useNeon ? require('../database/neon_db') : require('../database/local_db');

const events = sequelize.define(
  "events",
  {
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    event_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    event_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = { events, sequelize };