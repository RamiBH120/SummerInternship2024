const multer = require("multer");
const express = require("express");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const photoController = require("../controllers/photoController");

router.get("/", photoController.getPhotos);

router.get("/:id_photo", photoController.getPhotoById);

router.get("/:id_event/photos", photoController.getPhotosByEvent);

router.post(
  "/upload/:id_event",
  upload.single("filename"),
  photoController.uploadToFirebase
);

router.post(
  "/upload",
  upload.single("filename"),
  photoController.uploadToFirebaseChat
);

router.delete("/:id_photo", photoController.removePhoto);

module.exports = router;
