const users_events = require("../models/users_events.models");

class users_eventsDao {
  async subscribeToEvent(req, res, next) {
    try {
      const { user_id, event_id } = req.body;

      const query = `
                INSERT INTO users_events (user_id, event_id, subscribed_at)
                VALUES (:user_id, :event_id, NOW())
                RETURNING *
            `;

      const data = await users_events.sequelize.query(query, {
        replacements: { user_id, event_id },
        type: users_events.sequelize.QueryTypes.INSERT,
      });

      if (data[0].length === 0) {
        return res.json({
          status: false,
          data: null,
          message: "Failed to subscribe to event",
        });
      }

      res.status(200).json({
        status: true,
        data: data[0][0],
        message: "Subscribed to event successfully",
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = users_eventsDao;
