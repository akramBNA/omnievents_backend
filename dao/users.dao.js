const { users } = require("../models/users.models");
const { roles } = require("../models/roles.models.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = process.env.AUTH_SECRET_KEY || "";

class usersDao {
  async getAllUsers(req, res, next) {
    try {
      const get_all_users_query =
        "SELECT * FROM users WHERE active=true ORDER BY user_id ASC";
      const get_all_users_data = await users.sequelize.query(
        get_all_users_query,
        {
          type: users.sequelize.QueryTypes.SELECT,
        },
      );
      if (get_all_users_data) {
        res.status(200).json({
          status: true,
          data: get_all_users_data,
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
      if (create_user_data) {
        res.status(201).json({
          status: true,
          data: create_user_data[0][0],
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
      const find_user_query = `SELECT * FROM users WHERE user_email = :user_email AND active=true`;
      const find_user_data = await users.sequelize.query(find_user_query, {
        replacements: { user_email },
        type: users.sequelize.QueryTypes.SELECT,
      });
      if (find_user_data.length > 0) {
        const user = find_user_data[0];
        const passwordMatch = await bcrypt.compare(
          user_password,
          user.user_password,
        )
                        
        if (passwordMatch) {
          const token = jwt.sign({ user_id: user.user_id }, SECRET_KEY, {
            expiresIn: "1h",
          });
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
