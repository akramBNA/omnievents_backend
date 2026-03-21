const users_eventsDao = require("../dao/users_events.dao");

const users_events_instance = new users_eventsDao();

module.exports = {
  subscribeToEvent: function (req, res, next) {
    users_events_instance.subscribeToEvent(req, res, next);
  },
};