const roles = require("../models/roles.models");

class rolesDao {
  async createRole(req, res, next) {
    try {
      const { role_type } = req.body;
      const create_role_query = `INSERT INTO roles (role_type) VALUES ('${role_type}') RETURNING *`;
      const create_role_data = await roles.sequelize.query(create_role_query, {
        type: roles.sequelize.QueryTypes.INSERT,
      });
      if (create_role_data) {
        res.status(201).json({
          status: true,
          data: create_role_data[0][0],
          message: "Created successfully",
        });
      } else {
        res.json({
          status: false,
          data: [],
          message: "Failed to create data",
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  async getAllRoles(req, res, next) {
    try {
      const get_all_roles_query =
        "SELECT * FROM roles  WHERE active='Y' ORDER BY role_id ASC";
      const get_all_roles_data = await roles.sequelize.query(
        get_all_roles_query,
        {
          type: roles.sequelize.QueryTypes.SELECT,
        },
      );
      if (get_all_roles_data) {
        res.status(200).json({
          status: true,
          data: get_all_roles_data,
          message: "Retrieved successfully",
        });
      } else {
        res.json({
          status: false,
          data: [],
          message: "Failed to retrieve data",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = rolesDao;