const WebSocket = require("ws");

const connectDB = require("../database/mongo");
const clientManager = require("./clientManager");

const messageRouter = require("./messageRouter");

const GeminiAdapter = require("./geminiAdapter");

const { handleAudioMessage } = require("./audioRouter");
const textRouter = require("./textRouter");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const representativeRouter = require("./representativeRouter");

function startWebSocketServer(server) {
  // connectDB()
  //   .then(async () => {
  //     console.log("✅ Database Ready");

  //     const Conversation = require("../models/Conversation");

  //     const data = await Conversation.create({
  //       sessionId: "TEST_SESSION_001",
  //       status: "active",
  //       messages: [
  //         {
  //           role: "user",
  //           text: "Hello MongoDB",
  //           source: "text",
  //         },
  //       ],
  //     });

  //     console.log("✅ Test document inserted");
  //     console.log(data);
  //   })
  //   .catch((err) => {
  //     console.error("❌ Failed to connect to MongoDB:", err);
  //   });

  connectDB().catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });

  const wss = new WebSocket.Server({
    server,
  });

  wss.on("connection", (socket, request) => {
    const url = new URL(request.url, CLIENT_URL);

    const companyId = url.searchParams.get("companyId");

    const mode = url.searchParams.get("mode") || "voice";

    socket.companyId = companyId;
    socket.mode = mode;

    socket.chatMode = "AI";
    socket.representative = null;

    console.log("✅ Frontend connected");

    console.log("🏢 Company ID:", companyId);
    console.log("🏢 Mode:", mode);

    clientManager.add(socket);

    // socket.on("message", async (message) => {
    //   try {
    //     // Binary frames are always raw mic audio (PCM16/16kHz/mono)
    //     if (Buffer.isBuffer(message)) {
    //       await handleAudioMessage(socket, message);
    //       return;
    //     }

    //     // Everything else is JSON control messages
    //     // (START_SESSION, TEXT, AUDIO_END, PING) -> messageRouter
    //     // handles all of these, including AUDIO_END. Don't
    //     // intercept AUDIO_END here — that was calling an
    //     // undefined function and silently swallowing the event.
    //     await messageRouter(socket, message.toString());
    //   } catch (err) {
    //     console.error("Message Router Error:", err);
    //   }
    // });

    socket.on("message", async (message) => {
      try {
        // ---------- TEXT ----------
        if (socket.mode === "text") {
          const data = JSON.parse(message);

          // Representative messages
          if (
            data.type === "REGISTER_REPRESENTATIVE" ||
            data.type === "GET_WAITING_CONVERSATIONS" ||
            data.type === "ACCEPT_CONVERSATION" ||
            data.type === "REPRESENTATIVE_MESSAGE" ||
            socket.representativeId
          ) {
            await representativeRouter(socket, data);
            return;
          }

          await textRouter(socket, data);

          return;
        }

        // ---------- VOICE ----------
        if (Buffer.isBuffer(message)) {
          await handleAudioMessage(socket, message);
          return;
        }

        await messageRouter(socket, message.toString());
      } catch (err) {
        console.error("Message Error:", err);
      }
    });

    socket.on("close", async () => {
      console.log("❌ Frontend disconnected");

      const conversationId = socket.conversationId;

      if (conversationId) {
        const conversation = clientManager.getConversation(conversationId);

        if (
          conversation &&
          conversation.representativeSocket &&
          conversation.representativeSocket.readyState === 1
        ) {
          conversation.representativeSocket.send(
            JSON.stringify({
              type: "CUSTOMER_DISCONNECTED",
              conversationId,
              text: "The customer disconnected.",
            }),
          );
        }

        await conversationStore.end(socket);
        clientManager.removeConversation(conversationId);
      }

      GeminiAdapter.close(socket);
      clientManager.remove(socket);
    });

    socket.on("error", (err) => {
      console.error("Socket Error:", err);
    });
  });
}

module.exports = {
  startWebSocketServer,
};
