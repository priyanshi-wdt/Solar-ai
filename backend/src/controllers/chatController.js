const geminiChatService = require("../services/geminiChat.service");
const conversationStore = require("../services/conversationStore");
const Conversation = require("../models/Conversation");

async function startConversation(req, res) {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "companyId is required",
      });
    }

    const conversationId = await conversationStore.start({
      companyId,
      conversationType: "chat",
    });

    return res.json({
      success: true,
      conversationId,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function sendMessage(req, res) {
  try {
    const { conversationId, message } = req.body;

    const conversation = await Conversation.findOne({
      sessionId: conversationId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // if (!companyId) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "companyId is required",
    //   });
    // }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    await conversationStore.append({
      conversationId,
      role: "user",
      text: message,
      source: "text",
    });

    const reply = await geminiChatService.sendMessage(
      conversation.companyId,
      message,
      conversation,
    );

    await conversationStore.append({
      conversationId,
      role: "assistant",
      text: reply,
      source: "text",
    });

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
  startConversation,
};
