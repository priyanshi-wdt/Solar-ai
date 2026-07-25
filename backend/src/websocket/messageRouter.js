const GeminiAdapter = require("./geminiAdapter");
const companyService = require("../services/companyService");

async function messageRouter(socket, message) {
  try {
    const data = JSON.parse(message);

    switch (data.type) {

      // ----------------------------------
      // Start Voice Session
      // ----------------------------------
     case "START_SESSION": {

  console.log("🟢 START_SESSION");

  const companyId = data.companyId || "abc-solar";

  socket.companyId = companyId;

  console.log("🏢 Company:", companyId);

  await GeminiAdapter.get(socket);

  return;
}

      // ----------------------------------
      // User Text Message
      // ----------------------------------
      case "TEXT": {

        if (!data.text) return;

        console.log("👤 User:", data.text);

        await GeminiAdapter.sendText(
          socket,
          data.text
        );

        return;
      }

      // ----------------------------------
      // Audio Stream Finished
      // ----------------------------------
      case "AUDIO_END": {

        console.log("🎤 AUDIO_END");

        GeminiAdapter.signalAudioStreamEnd(socket);

        return;
      }

      // ----------------------------------
      // Ping (optional)
      // ----------------------------------
      case "PING": {

        socket.send(
          JSON.stringify({
            type: "PONG",
          })
        );

        return;
      }

      // ----------------------------------
      // Unknown Message
      // ----------------------------------
      default: {

        console.log(
          "⚠ Unknown Message:",
          data.type
        );

        return;
      }
    }
  } catch (err) {
    console.error(
      "❌ Message Router Error:"
    );

    console.error(err);
  }
}

module.exports = messageRouter;