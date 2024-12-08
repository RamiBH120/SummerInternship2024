const Event = require("../models/event");

async function getEvents(req, res) {
  Event.find({})
    .exec()
    .then((events) => {
      res.status(200).json({ title: "success", message: events });
    })
    .catch((error) => {
      res.status(500).json({ title: "Server error: ", message: error.message });
    });
}

async function getEventById(req, res) {
  Event.findById(req.params.id_event)
    .exec()
    .then((event) => {
      if (!event)
        res
          .status(404)
          .json({ title: "error", message: "Couldn't find Event" });
      else res.status(200).json({ title: "success", message: event });
    })
    .catch((error) => {
      res.status(500).json({ title: "Server error: ", message: error.message });
    });
}

async function addEvent(req, res) {
  try {
    const event = req.body;
    const { startDate, endDate } = event;
    if (startDate > endDate)
      res.status(500).json({
        title: "error",
        message: "startDate must be greater than endDate",
      });
    else {
      const newItem = new Event(event);
      const saved = await newItem.save();
      if (!saved)
        res.status(500).json({ title: "error", message: "error saving event" });
      else res.status(201).json({ title: "success", message: saved._id });
    }
  } catch (err) {
    res.status(500).json({ title: "Server error", message: err.message });
  }
}

async function removeEvent(req, res) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id_event);
    if (!event)
      res.status(404).json({ title: "error", message: "Couldn't find Event" });
    else
      res
        .status(200)
        .json({ title: "success", message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ title: "Server error", message: err.message });
  }
}

async function updateEvent(req, res) {
  try {
    const { startDate, endDate } = req.body;
    if (startDate > endDate)
      res.status(500).json({
        title: "error",
        message: "startDate must be greater than endDate",
      });
    else {
      const event = await Event.findByIdAndUpdate(
        req.params.id_event,
        req.body,
        {
          new: true,
        }
      );
      if (!event)
        res
          .status(404)
          .json({ title: "error", message: "Couldn't find Event" });
      else res.status(200).json({ title: "success", message: event });
    }
  } catch (err) {
    res.status(500).json({ title: "Server error", message: err.message });
  }
}

const participateInEvent = async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (new Date() > event.endDate) {
      return res
        .status(400)
        .json({ error: "Cannot participate in a past event" });
    }

    if (event.participants.includes(userId)) {
      return res.status(400).json({ error: "User already participating" });
    }

    event.participants.push(userId);
    await event.save();

    res.status(200).json({ message: "Participation avec succés", event });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const cancelParticipation = async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (new Date() > event.endDate) {
      return res
        .status(400)
        .json({ error: "Cannot cancel participation in a past event" });
    }

    const participantIndex = event.participants.indexOf(userId);
    if (participantIndex === -1) {
      return res.status(400).json({ error: "User is not a participant" });
    }

    event.participants.splice(participantIndex, 1);
    await event.save();

    res.status(200).json({ message: "Participation annulée", event });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getUserParticipatedEvents = async (req, res) => {
  const { userId } = req.params;

  try {
    const events = await Event.find({ participants: userId });

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const hasUserParticipated = async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const hasParticipated = event.participants.includes(userId);

    res.status(200).json({ hasParticipated });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getEvents,
  getEventById,
  addEvent,
  removeEvent,
  updateEvent,
  participateInEvent,
  cancelParticipation,
  getUserParticipatedEvents,
  hasUserParticipated,
};
