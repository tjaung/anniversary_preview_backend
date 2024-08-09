const dotenv = require("dotenv");

const uri = process.env.MONGO_URI || dotenv.config().parsed.MONGO_URI;

const mongoose = require("mongoose");

let db = mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "anniversary",
  })
  .then(() => {
    // listen for requests
    // app.listen(process.env.PORT, () => {
    console.log("connected to db & listening on port", process.env.PORT);
    // });
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = db;
