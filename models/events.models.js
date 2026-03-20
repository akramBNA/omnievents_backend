const { Sequelize, DataTypes } = require("sequelize");

const useNeon = process.env.DB_PROVIDER === "neon";
const { sequelize } = useNeon ? require("../database/neon_db") : require("../database/local_db");

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
      validate: {
        notEmpty: true,
      },
    },
    event_details: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    event_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    event_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isValidDateRange() {
          if (this.event_end_date < this.event_start_date) {
            throw new Error("End date cannot be before start date");
          }
        },
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = { events, sequelize };
