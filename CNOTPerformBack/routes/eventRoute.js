const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/", eventController.getEvents);

router.get("/:id_event", eventController.getEventById);

router.post("/", eventController.addEvent);

router.put("/:id_event", eventController.updateEvent);

router.delete("/:id_event", eventController.removeEvent);

router.post(
  "/:eventId/participate/:userId",
  eventController.participateInEvent
);
router.delete("/:eventId/cancel/:userId", eventController.cancelParticipation);
router.get(
  "/users/participated/:userId",
  eventController.getUserParticipatedEvents
);

router.get(
  "/:eventId/has-participated/:userId",
  eventController.hasUserParticipated
);

module.exports = router;
