const geminiChatService = require("../services/geminiChat.service");

async function sendMessage(req, res) {
  try {
    const { companyId, message, history = [] } = req.body;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "companyId is required",
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const reply = await geminiChatService.sendMessage(
      companyId,
      message,
      history
    );

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  sendMessage,
};