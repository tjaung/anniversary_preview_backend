// controllers/messageController.js
const Message = require("../models/messageModel");
const mongoose = require("mongoose");
const {
  filterAndGroupMessagesBySenderAndTime,
  editTimestampLogs,
} = require("../helperFunctions/filterAndGroupMessagesBySenderAndTime");
const {
  processMessages,
} = require("../helperFunctions/filterAndGroupMessagesBySenderAndTime");

// get all Messages
const getMessages = async (req, res) => {
  const user_id = req.user._id.toString();
  console.log("get messages: ", user_id);
  const messages = await Message.find({ user_ids: user_id }).sort({
    timestamp_ms: 1,
  });

  // Apply helper functions
  let groupedMessages = await filterAndGroupMessagesBySenderAndTime(messages);
  groupedMessages = await editTimestampLogs(groupedMessages);

  res.status(200).json(groupedMessages);
};

// get Message range
const getMessageRange = async (req, res) => {
  console.log(req.headers);
  const user_id = req.user._id.toString();
  const dateStart = req.headers.dateStart || req.headers.datestart;
  const dateEnd = req.headers.dateEnd || req.headers.dateend;
  // console.log("date start", dateStart);
  // console.log("date end", dateEnd);

  // console.log("get messages: ", user_id);
  // console.log("date range: ", dateStart, " ", dateEnd);

  let query = {};
  if (dateEnd === "") {
    query = {
      user_ids: user_id,
      timestamp_ms: { $gte: dateStart },
    };
  } else {
    query = {
      user_ids: user_id,
      timestamp_ms: { $gte: dateStart, $lte: dateEnd },
    };
  }
  const messages = await Message.find(query).sort({
    timestamp_ms: 1,
  });

  // Apply helper functions
  let groupedMessages = await processMessages(messages);

  console.log("controller output", groupedMessages);
  // console.log(
  //   "controller output",
  //   groupedMessages.beginning.firstMeetings.messages
  // );

  // console.log(
  //   "controller output",
  //   groupedMessages.beginning.postHITC.messages.slice(0, 20)
  // );
  // console.log(
  //   "controller output",
  //   groupedMessages.catchingFeels.BBB.messages(0, 20)
  // );
  res.status(200).json(groupedMessages);
};

module.exports = {
  getMessages,
  getMessageRange,
};
