const { users } = require("../models/users.models");
const { roles } = require("../models/roles.models.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = process.env.AUTH_SECRET_KEY || "";

class usersDao {
  async getAllUsers(req, res, next) {
    try {
      let { limit = 10, offset = 0, keyword = "" } = req.query;

      limit = Math.min(parseInt(limit) || 10, 50);
      offset = parseInt(offset) || 0;
      keyword = keyword.trim();

      const searchKeyword = keyword ? `${keyword}%` : "%";

      const query = `
      WITH filtered AS (
        SELECT 
          u.user_id,
          u.user_name,
          u.user_lastname,
          u.user_email,
          u.user_role_id,
          r.role_type
        FROM users u
        JOIN roles r ON u.user_role_id = r.role_id
        WHERE u.active = true
        AND (
          u.user_name ILIKE :search
          OR u.user_lastname ILIKE :search
          OR u.user_email ILIKE :search
        )
      ),
      total_count AS (
        SELECT COUNT(*)::int AS total FROM filtered
      )
      SELECT 
        (SELECT total FROM total_count) AS total,
        json_agg(u) AS users
      FROM (
        SELECT *
        FROM filtered
        ORDER BY user_id ASC
        LIMIT :limit OFFSET :offset
      ) u;
    `;

      const [result] = await users.sequelize.query(query, {
        replacements: {
          search: searchKeyword,
          limit,
          offset,
        },
        type: users.sequelize.QueryTypes.SELECT,
      });

      const usersList = result?.users || [];

      return res.status(200).json({
        status: true,
        data: usersList,
        total: result?.total || 0,
        limit,
        offset,
        message:
          usersList.length === 0
            ? "No users found"
            : "Users retrieved successfully",
      });
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

  async signUp(req, res, next) {
    try {
      const { user_name, user_lastname, user_email, user_password } = req.body;
      const existingUser = await users.findOne({
        where: { user_email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }
      const hashedPassword = await bcrypt.hash(user_password, 10);
      const create_user_query = `INSERT INTO users (user_name, user_lastname, user_email, user_password) VALUES (:user_name, :user_lastname, :user_email, :user_password) RETURNING *`;
      const create_user_data = await users.sequelize.query(create_user_query, {
        replacements: {
          user_name,
          user_lastname,
          user_email,
          user_password: hashedPassword,
        },
        type: users.sequelize.QueryTypes.INSERT,
      });

      const token = jwt.sign(
        {
          user_id: create_user_data[0][0].user_id,
          role: "user",
        },
        SECRET_KEY,
        { expiresIn: "1h" },
      );
      
      if (create_user_data) {
        res.status(201).json({
          status: true,
          data: create_user_data[0][0],
          token: token,
          message: "User created successfully",
        });
      } else {
        res.json({
          status: false,
          data: [],
          message: "Failed to create user",
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const { user_email, user_password } = req.body;

      const find_user_query = `
      SELECT u.*, r.role_type
      FROM users u
      JOIN roles r ON u.user_role_id = r.role_id
      WHERE u.user_email = :user_email
      AND u.active = true
    `;

      const find_user_data = await users.sequelize.query(find_user_query, {
        replacements: { user_email },
        type: users.sequelize.QueryTypes.SELECT,
      });

      if (find_user_data.length > 0) {
        const user = find_user_data[0];

        const passwordMatch = await bcrypt.compare(
          user_password,
          user.user_password,
        );

        if (passwordMatch) {
          const token = jwt.sign(
            { user_id: user.user_id, role: user.role_type },
            SECRET_KEY,
            { expiresIn: "1h" },
          );

          res.status(200).json({
            status: true,
            data: user,
            token: token,
            message: "Authentication successful",
          });
        } else {
          res.status(401).json({
            status: false,
            data: [],
            message: "Invalid credentials",
          });
        }
      } else {
        res.status(404).json({
          status: false,
          data: [],
          message: "User not found",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = usersDao;
