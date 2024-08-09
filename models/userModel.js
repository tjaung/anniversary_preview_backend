const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user: {
    type: String,
    required: true,
    unique: true,
  },
  password1: {
    type: String,
    required: true,
  },
  password2: {
    type: String,
    required: true,
  },
});

// Statics

// login
userSchema.statics.login = async function (question, answer) {
  const query = {};
  query[question] = answer;
  if (!question) {
    throw Error("No associated question");
  }
  if (!answer) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne(query).select(question);
  // let pass = false;
  if (!user) {
    throw Error("Incorrect answer");
  }
  console.log("return from model: ", user);
  // pass = true;
  return user;
};

module.exports = mongoose.model("user", userSchema, "user");
