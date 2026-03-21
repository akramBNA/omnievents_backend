const { Sequelize, DataTypes } = require("sequelize");

const { roles } = require("./roles.models");
const { users } = require("./users.models");
const { events } = require("./events.models");
const useNeon = process.env.DB_PROVIDER === "neon";
const { sequelize } = useNeon
  ? require("../database/neon_db")
  : require("../database/local_db");

const users_events = sequelize.define(
  "users_events",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: users,
        key: "user_id",
      },
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: events,
        key: "event_id",
      },
    },
    subscribed_at: {
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
  },
);

module.exports = { users_events, sequelize };
