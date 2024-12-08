const Image = require("../models/image");
const fs = require("fs");

const upload = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image file uploaded");
  }

  const image = new Image({
    filename: req.file.filename,
    path: req.file.path,
    data: fs.readFileSync(req.file.path),
    contentType: req.file.mimetype,
  });

  try {
    await image.save();
    res.status(200).send(image);
  } catch (error) {
    res.status(500).send("Error saving image to the database");
  }
};

module.exports = { upload };
