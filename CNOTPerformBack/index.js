const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const config = require("./database/dbConfig.json");
const logger = require("morgan");
const cors = require("cors");
const userRouter = require("./routes/userroute");
const eventRouter = require("./routes/eventRoute");
const imageRouter = require("./routes/imageRoute");
const fileRouter = require("./routes/fileroute");
const photoRouter = require("./routes/photoRoute");

const messageRouter = require("./routes/messageRoute");
const mailroute = require("./routes/mailroute");
const bourseroute = require("./routes/bourseRoute");
const predictionroute = require("./routes/predictionRoute");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Ensure this matches your client's URL exactly
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);



app.use("/public/images", express.static(__dirname + "/public/images"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));


const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", userRouter);
app.use("/mail", mailroute);
app.use("/bourses", bourseroute(io));
app.use("/events", eventRouter);
app.use("/images", imageRouter);
app.use("/photos", photoRouter);
app.use("/files", fileRouter);
app.use("/predictions", predictionroute);

app.use("/api", messageRouter);
app.use("/uploads", express.static("public/uploads"));


mongoose
  .connect(config.mongo.uri)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Could not connect to database", err);
  });

const initSocketIo = require("./controllers/socketController");
initSocketIo(io); // Pass the 'io' instance directly to the socket controller

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
