const rolesDao = require("../dao/roles.dao");

const roles_instance = new rolesDao();

module.exports = {
  getAllRoles: function (req, res, next) {
    roles_instance.getAllRoles(req, res, next);
  },
  createRole: function (req, res, next) {
    roles_instance.createRole(req, res, next);
  },
};