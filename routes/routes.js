const express = require("express");
const router = express.Router();

const users_controller = require("../controllers/users.controllers");
const roles_controller = require("../controllers/roles.controllers");

// ROLES ROUTES:
router.get("/roles/getAllRoles/", roles_controller.getAllRoles);
router.post("/roles/CreateRole/", roles_controller.createRole);

// USERS ROUTES:
router.get("/users/getAllUsers/", users_controller.getAllUsers);
router.post("/users/signUp/", users_controller.signUp);
router.post("/users/signIn/", users_controller.signIn);

module.exports = router;