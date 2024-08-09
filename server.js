require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/user");
const cors = require("cors");
// const db = require("./db/connection.js");

// express app
const app = express();

// middleware
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  cors({
    origin: [
      "https://localhost:3000",
      "https://anniversary-backend.onrender.com",
    ],
  })
);
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes

// User login and signup
app.use("/api/user", userRoutes);

app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Home page");
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "anniversary",
  })
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
