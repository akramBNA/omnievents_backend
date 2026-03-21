const express = require("express");
const router = express.Router();

const authenticateToken = require('../middleware/authentication.middleware');
const authorizeRoles = require('../middleware/roles.middleware');


const users_controller = require("../controllers/users.controllers");
const roles_controller = require("../controllers/roles.controllers");
const events_controller = require("../controllers/events.controllers");
const users_events_controller = require("../controllers/users_events.controllers");


// ROLES ROUTES:
router.get("/roles/getAllRoles/",authenticateToken, roles_controller.getAllRoles);
router.post("/roles/CreateRole/", authenticateToken, roles_controller.createRole);

// USERS ROUTES:
router.get("/users/getAllUsers/", authenticateToken, users_controller.getAllUsers);
router.post("/users/signUp/", users_controller.signUp);
router.post("/users/signIn/", users_controller.signIn);

// EVENTS ROUTES
router.get("/events/getAllEvents", authenticateToken, events_controller.getAllEvents);
router.post("/events/createEvent", authenticateToken, events_controller.createEvent);
router.put("/events/updateEvent/:id", authenticateToken, events_controller.updateEvent);
router.delete("/events/deleteEvent/:id", authenticateToken, events_controller.deleteEvent);

// USERS_EVENTS ROUTES
router.post("/users_events/subscribeToEvent", authenticateToken, users_events_controller.subscribeToEvent);

module.exports = router;