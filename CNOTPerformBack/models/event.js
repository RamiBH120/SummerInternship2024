const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeEvent = {
  FORMATION: "formation",
  INITIATIVE: "initiative",
  ATELIER: "atelier",
};

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "event title is required"],
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: [true, "event startDate is required"],
    },
    endDate: {
      type: Date,
      required: [true, "event endDate is required"],
    },
    budget: {
      type: Number,
      default: 0,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    seats: {
      type: Number,
      default: 0,
    },
    typeEvent: {
      type: String,
      enum: typeEvent,
      default: typeEvent.ATELIER,
    },
    category: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
