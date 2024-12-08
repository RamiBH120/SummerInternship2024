const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const config = require("../config/firebase.config");
const Photo = require("../models/photo");
const Event = require("../models/event");

initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

async function getPhotos(req, res) {
  Photo.find({})
    .exec()
    .then((photo) => {
      res.status(200).json({ title: "success", message: photo });
    })
    .catch((error) => {
      res.status(500).json({ title: "Server error: ", message: error.message });
    });
}

async function getPhotoById(req, res) {
  Photo.findById(req.params.id_photo)
    .exec()
    .then((photo) => {
      if (!photo)
        res
          .status(404)
          .json({ title: "error", message: "Couldn't find Photo" });
      else res.status(200).json({ title: "success", message: photo });
    })
    .catch((error) => {
      res.status(500).json({ title: "Server error: ", message: error.message });
    });
}

async function removePhoto(req, res) {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id_photo);
    if (!photo)
      res.status(404).json({ title: "error", message: "Couldn't find Photo" });
    else {
      res
        .status(204)
        .json({ title: "deleted", message: "Deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ title: "Server error", message: err.message });
  }
}

async function getPhotosByEvent(req, res) {
  try {
    const photo = await Photo.find({
      id_event: req.params.id_event,
    });

    res.status(200).json({ title: "success", message: photo });
  } catch (err) {
    res.status(500).json({ title: "error", message: err.message });
  }
}

async function uploadToFirebase(req, res) {
  try {
    const event = await Event.findById(req.params.id_event);

    if (!event)
      return res.status(404).send({
        title: "error",
        message: "Event not found",
      });
    else {
      const dateTime = giveCurrentDateTime();

      const storageRef = ref(
        storage,
        `images/${req.file.originalname + "       " + dateTime}`
      );

      // Create file metadata including the content type
      const metadata = {
        contentType: req.file.mimetype,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);

      event.imgUrl = downloadURL;

      await Event.findByIdAndUpdate(req.params.id_event, event, {
        next: true,
      });
      //save the uploaded file to the database
      const photo = new Photo({
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        fileUrl: downloadURL,
        id_event: req.params.id_event,
      });

      const doc = await photo.save();

      if (!doc)
        return res.status(500).send({
          title: "error",
          message: "file not saved in database",
        });
      else
        return res.status(200).send({
          title: "file uploaded to firebase storage",
          message: downloadURL,
        });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};




async function uploadToFirebaseChat(req, res) {
  try {

      const dateTime = giveCurrentDateTime();

      const storageRef = ref(
        storage,
        `files/${req.file.originalname + "       " + dateTime}`
      );

      // Create file metadata including the content type
      const metadata = {
        contentType: req.file.mimetype,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);

      
    
       return res.status(200).send({
          title: "file uploaded to firebase storage",
          message: downloadURL,
        });
    
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  getPhotos,
  getPhotoById,
  removePhoto,
  getPhotosByEvent,
  uploadToFirebase,
  uploadToFirebaseChat
};
