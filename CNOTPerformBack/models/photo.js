const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  fileName: String,
  contentType: String,
  fileUrl: String,
  id_event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
});

module.exports = mongoose.model("Photo", photoSchema);
