const { randomUUID } = require("crypto");
const Conversation = require("../models/Conversation");

class ConversationStore {
  constructor() {
    // socket -> sessionId (string)
    this.sessionIds = new Map();
  }

  async start(socket) {
    const sessionId = randomUUID();

    this.sessionIds.set(socket, sessionId);

    try {
      await Conversation.create({
        sessionId,
        messages: [],
        status: "active",
      });

      console.log("🗄️  Conversation started:", sessionId);
    } catch (err) {
      console.error("❌ Failed to create conversation doc:", err);
    }

    return sessionId;
  }

  getSessionId(socket) {
    return this.sessionIds.get(socket);
  }

  async append(socket, role, text, source = "text") {
    if (!text || !text.trim()) return;

    const sessionId = this.sessionIds.get(socket);
    if (!sessionId) return; // conversation wasn't started, nothing to log

    try {
      await Conversation.updateOne(
        { sessionId },
        {
          $push: {
            messages: { role, text: text.trim(), source },
          },
        }
      );
    } catch (err) {
      console.error("❌ Failed to append message:", err);
    }
  }

  async end(socket) {
    const sessionId = this.sessionIds.get(socket);
    if (!sessionId) return;

    try {
      await Conversation.updateOne(
        { sessionId },
        { $set: { status: "ended", endedAt: new Date() } }
      );

      console.log("🗄️  Conversation ended:", sessionId);
    } catch (err) {
      console.error("❌ Failed to end conversation:", err);
    }

    this.sessionIds.delete(socket);
  }
}

module.exports = new ConversationStore();
