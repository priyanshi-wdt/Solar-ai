const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    // "text"  -> typed by the user, or a rare direct text reply
    // "voice" -> transcribed from audio (mic input or AI speech)
    source: {
      type: String,
      enum: ["text", "voice"],
      default: "text",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema({
  // one conversation per websocket connection/session
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  messages: {
    type: [messageSchema],
    default: [],
  },
  status: {
    type: String,
    enum: ["active", "ended"],
    default: "active",
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
