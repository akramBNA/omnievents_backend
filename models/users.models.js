const { Sequelize, DataTypes } = require("sequelize");
const { roles } = require("../models/roles.models.js");
const useNeon = process.env.DB_PROVIDER === 'neon';
const { sequelize } = useNeon ? require('../database/neon_db') : require('../database/local_db');

const users = sequelize.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      references: {
        model: roles,
        key: "role_id",
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
  }
);

users.belongsTo(roles, { foreignKey: "user_role_id", as: "roles" });

module.exports = { users, sequelize };