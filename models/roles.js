const { Sequelize, DataTypes } = require("sequelize");
const useNeon = process.env.DB_PROVIDER === 'neon';
const { sequelize } = useNeon ? require('../database/neon_db') : require('../database/local_db');

const roles = sequelize.define(
  "roles",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_type: {
      type: DataTypes.STRING,
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

module.exports = {
  roles,
  sequelize,
};