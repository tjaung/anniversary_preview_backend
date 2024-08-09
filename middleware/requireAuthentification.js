const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  //verfiy authentification
  const { authorization } = req.headers;
  console.log(req.headers);
  if (!authorization)
    return res.status(401).json({ error: "Authorization token required" });

  const token = authorization.split(" ")[1];
  console.log("require auth token", token);
  try {
    const _id = token;

    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
