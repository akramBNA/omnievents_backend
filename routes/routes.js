const express = require("express");
const router = express.Router();

const authenticateToken = require('../middleware/authentication.middleware');


const users_controller = require("../controllers/users.controllers");
const roles_controller = require("../controllers/roles.controllers");
const events_controller = require("../controllers/events.controllers");


// ROLES ROUTES:
router.get("/roles/getAllRoles/",authenticateToken, roles_controller.getAllRoles);
router.post("/roles/CreateRole/", authenticateToken, roles_controller.createRole);

// USERS ROUTES:
router.get("/users/getAllUsers/", authenticateToken, users_controller.getAllUsers);
router.post("/users/signUp/", authenticateToken, users_controller.signUp);
router.post("/users/signIn/", authenticateToken, users_controller.signIn);

// EVENTS ROUTES
router.get("/events/getAllEvents", authenticateToken, events_controller.getAllEvents);
router.post("/events/createEvent", authenticateToken, events_controller.createEvent);
router.put("/events/updateEvent/:id", authenticateToken, events_controller.updateEvent);
router.delete("/events/deleteEvent/:id", authenticateToken, events_controller.deleteEvent);

module.exports = router;