const express = require("express");
const router = express.Router();

const multer = require("multer");

const File = require("../models/file");
const fs = require("fs");
const bourse = require("../models/bourse");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/:id/:type", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No image file uploaded");
    }
  
    const file = new File({
      filename: req.file.filename,
      path: req.file.path,
      data: fs.readFileSync(req.file.path),
      bourse:req.params.id,
      contentType: req.file.mimetype,
    });
    
    const Bourse = await bourse.findById(req.params.id);

    if(req.params.type === 'Rapport Technique'){
    await bourse.findByIdAndUpdate(req.params.id,{
      rapportTech: req.file.path
    })
    } else {
      await bourse.findByIdAndUpdate(req.params.id,{
        rapportFinan: req.file.path
      })
    }
    
    try {
      await file.save();
      res.status(200).send(file);
    } catch (error) {
      res.status(500).send("Error saving file to the database");
    }
  });

module.exports = router;
