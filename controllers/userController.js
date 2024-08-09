const jwt = require("jsonwebtoken");

const user = require("../models/userModel");

const createJWToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

const loginUser = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const userLogin = await user.login(question, answer);
    const token = createJWToken(userLogin._id);
    res.status(200).json({ userLogin, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
};
