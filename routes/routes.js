const express = require("express");
const router = express.Router();

const users_controller = require("../controllers/users.controllers");
const roles_controller = require("../controllers/roles.controllers");

// ROLES ROUTES:
router.get("/roles/getAllRoles/", roles_controller.getAllRoles);
router.post("/roles/CreateRole/", roles_controller.createRole);