const GeminiAdapter = require("./geminiAdapter");

async function handleAudioMessage(socket, audioBuffer) {
  try {
    console.log("🎤 Audio Chunk");
    console.log("Bytes:", audioBuffer.length);

    await GeminiAdapter.sendAudio(
      socket,
      audioBuffer
    );

  } catch (err) {
    console.error("❌ Audio Router Error");
    console.error(err);
  }
}

module.exports = {
  handleAudioMessage,
};