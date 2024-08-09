const express = require("express");
const requireAuth = require("../middleware/requireAuthentification");
const {
  createMessage,
  getMessageRange,
  getMessage,
  deleteMessage,
  updateMessage,
} = require("../controllers/messageController");

// ensure authentification is correct

const router = express.Router();

// before anything else ensure authentification
router.use(requireAuth);

// GET all Messages
// router.get("/", getMessages);

//GET a single Message
router.get("/", getMessageRange);

// POST a new Message
// router.post("/", createMessage);

// // DELETE a Message
// router.delete("/:id", deleteMessage);

// // UPDATE a Message
// router.patch("/:id", updateMessage);

module.exports = router;
