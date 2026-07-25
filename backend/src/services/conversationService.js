// const { randomUUID } = require("crypto");

// const Session = require("../models/Session");
// const Message = require("../models/Message");

// class ConversationService {
//   constructor() {
//     this.sessions = new Map();
//   }

//   async createSession(socket) {
//     const session = await Session.create({
//       sessionId: randomUUID(),
//       status: "ACTIVE",
//     });

//     this.sessions.set(socket, session);

//     console.log("✅ Session Created:", session.sessionId);

//     return session;
//   }

//   async getSession(socket) {
//     if (this.sessions.has(socket)) {
//       return this.sessions.get(socket);
//     }

//     return await this.createSession(socket);
//   }

//   async saveUserMessage(socket, text) {
//     const session = await this.getSession(socket);

//     await Message.create({
//       sessionId: session._id,
//       role: "user",
//       message: text,
//     });

//     console.log("💾 User Message Saved");
//   }

//   async saveAIMessage(socket, text) {
//     const session = await this.getSession(socket);

//     await Message.create({
//       sessionId: session._id,
//       role: "assistant",
//       message: text,
//     });

//     console.log("💾 AI Message Saved");
//   }

//   async endSession(socket) {
//     const session = this.sessions.get(socket);

//     if (!session) return;

//     session.status = "ENDED";
//     session.endedAt = new Date();

//     await session.save();

//     this.sessions.delete(socket);

//     console.log("✅ Session Ended");
//   }
// }

// module.exports = new ConversationService();