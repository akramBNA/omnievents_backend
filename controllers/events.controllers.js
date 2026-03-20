const eventsDao = require("../dao/events.dao");

const events_instance = new eventsDao();

module.exports = {
  getAllEvents: (req, res, next) =>
    events_instance.getAllEvents(req, res, next),

  createEvent: (req, res, next) =>
    events_instance.createEvent(req, res, next),

  updateEvent: (req, res, next) =>
    events_instance.updateEvent(req, res, next),

  deleteEvent: (req, res, next) =>
    events_instance.deleteEvent(req, res, next),
};