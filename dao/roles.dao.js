const roles = require("../models/roles.models");

class rolesDao {
  async getAllRoles(req, res, next) {
    try {
      const get_all_roles_query =
        "SELECT * FROM roles  WHERE active=true ORDER BY role_id ASC";
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

  async createRole(req, res, next) {
    try {
      const { role_type } = req.body;
      const create_role_query = `INSERT INTO roles (role_type) VALUES (:role_type) RETURNING *`;
      const create_role_data = await roles.sequelize.query(create_role_query, {
        replacements: { role_type },
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

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role_id } = req.body;

      const query = `
      UPDATE users
      SET user_role_id = :role_id
      WHERE user_id = :id
      RETURNING *;
    `;

      const [result] = await users.sequelize.query(query, {
        replacements: { id, role_id },
        type: users.sequelize.QueryTypes.UPDATE,
      });

      if (result.length === 0) {
        return res.json({
          status: false,
          data: null,
          message: "Failed to update user role",
        });
      }

      res.status(200).json({
        status: true,
        data: result[0],
        message: "Role updated successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = rolesDao;
