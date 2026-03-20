const usersDao = require("../dao/users.dao");

const users_instance = new usersDao();

module.exports = {
  getAllUsers: function (req, res, next) {
    users_instance.getAllUsers(req, res, next);
  },
  signUp: function (req, res, next) {
    users_instance.signUp(req, res, next);
  },
  signIn: function (req, res, next) {
    users_instance.signIn(req, res, next);
  },
};