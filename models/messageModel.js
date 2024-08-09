const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userIdsSchema = new Schema({ id: String });
const messageSchema = new Schema({
  sender_name: {
    type: String,
    required: true,
  },
  timestamp_ms: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
  },
  share: {
    link: {
      type: String,
    },
    share_text: {
      type: String,
    },
    original_content_owner: {
      type: String,
    },
    profile_share_username: { type: String },
    profile_share_name: { type: String },
  },
  photos: {
    type: Array,
  },
  videos: {
    type: Array,
  },
  is_geo_blocked_for_viewer: {
    type: Boolean,
  },
  reactions: {
    reaction: {
      type: String,
    },
    actor: {
      type: String,
    },
  },
  user_ids: {
    type: Array,
    required: true,
  },
  source: {
    type: String,
  },
});

module.exports = mongoose.model("message", messageSchema, "message");
