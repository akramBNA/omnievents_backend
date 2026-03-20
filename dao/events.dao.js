const events = require("../models/events.models");

class eventsDao {
  async getAllEvents(req, res, next) {
    try {
      const query = `
        SELECT * FROM events
        WHERE active = true
        ORDER BY event_start_date ASC
      `;

      const data = await events.sequelize.query(query, {
        type: events.sequelize.QueryTypes.SELECT,
      });

      if(data.length === 0) {
        return res.json({
          status: false,
          data: [],
          message: "No events found",
        });
      };

      res.status(200).json({
        status: true,
        data,
        message: "Events retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  }

  async createEvent(req, res, next) {
    try {
      const { event_name, event_details, event_start_date, event_end_date } =
        req.body;

      const query = `
        INSERT INTO events 
        (event_name, event_details, event_start_date, event_end_date)
        VALUES (:event_name, :event_details, :event_start_date, :event_end_date)
        RETURNING *
      `;

      const data = await events.sequelize.query(query, {
        replacements: {
          event_name,
          event_details,
          event_start_date,
          event_end_date,
        },
        type: events.sequelize.QueryTypes.INSERT,
      });

      if(data[0].length === 0) {
        return res.json({
          status: false,
          data: null,
          message: "Failed to create event",
        });
      };

      res.status(201).json({
        status: true,
        data: data[0][0],
        message: "Event created successfully",
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;

      const { event_name, event_details, event_start_date, event_end_date } =
        req.body;

      const query = `
        UPDATE events
        SET 
          event_name = :event_name,
          event_details = :event_details,
          event_start_date = :event_start_date,
          event_end_date = :event_end_date
        WHERE event_id = :id
        RETURNING *
      `;

      const data = await events.sequelize.query(query, {
        replacements: {
          id,
          event_name,
          event_details,
          event_start_date,
          event_end_date,
        },
        type: events.sequelize.QueryTypes.UPDATE,
      });

      if (data[0].length === 0) {
        return res.json({
          status: false,
          data: null,
          message: "Event not found",
        });
      }

      res.status(200).json({
        status: true,
        data: data[0][0],
        message: "Event updated successfully",
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteEvent(req, res, next) {
    try {
      const { id } = req.params;

      const query = `
        UPDATE events
        SET active = false
        WHERE event_id = :id
        RETURNING *
      `;

      const data = await events.sequelize.query(query, {
        replacements: { id },
        type: events.sequelize.QueryTypes.UPDATE,
      });

      if (data[0].length === 0) {
        return res.json({
          status: false,
          data: null,
          message: "Event not found",
        });
      }

      res.status(200).json({
        status: true,
        data: null,
        message: "Event deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = eventsDao;
