const Conversation = require("../models/Conversation");
const conversationStore = require("../services/conversationStore");
const clientManager = require("./clientManager");
const isPositiveResponse = require("../utils/isPositiveResponse");
const geminiChatService = require("../services/geminiChat.service");

async function textRouter(socket, data) {
    switch (data.type) {
        case "START_CHAT":
            await startChat(socket);
            break;

        case "TEXT":
            await sendMessage(socket, data.text);
            break;

        case "END_CHAT":
            await conversationStore.end(socket);
            break;

        default:
            console.log("Unknown text message:", data);
    }
}

async function startChat(socket) {
    const conversationId = await conversationStore.start({
        socket,
        companyId: socket.companyId,
        conversationType: "chat",
    });

    socket.conversationId = conversationId;

    clientManager.createConversation(conversationId, socket, socket.companyId);
    //   const greeting = await geminiChatService.startConversation(socket.companyId);

    console.time("Greeting");

    const greeting = await geminiChatService.startConversation(socket.companyId);

    console.timeEnd("Greeting");

    await conversationStore.append({
        conversationId,
        role: "assistant",
        text: greeting,
        source: "text",
    });

    socket.send(
        JSON.stringify({
            type: "TEXT",
            text: greeting,
        }),
    );
}

async function sendMessage(socket, text) {
    const conversationId = conversationStore.getSessionId(socket);
    const activeConversation = clientManager.getConversation(conversationId);

    // Check if AI is waiting for representative confirmation
    if (activeConversation.awaitingRepresentativeConfirmation) {
        if (isPositiveResponse(text)) {
            activeConversation.awaitingRepresentativeConfirmation = false;

            activeConversation.status = "WAITING";

            socket.send(
                JSON.stringify({
                    type: "WAITING_FOR_REPRESENTATIVE",
                    text: "Please wait while we connect you with a representative.",
                }),
            );

            console.log("🟡 Waiting for representative:", conversationId);

            return;
        }

        // User said no
        activeConversation.awaitingRepresentativeConfirmation = false;
    }

    const conversation = await Conversation.findOne({
        sessionId: conversationId,
    });

    if (!conversation) {
        socket.send(
            JSON.stringify({
                type: "ERROR",
                text: "Conversation not found.",
            }),
        );
        return;
    }

    await conversationStore.append({
        socket,
        role: "user",
        text,
        source: "text",
    });

    console.time("Gemini Response");

    const reply = await geminiChatService.sendMessage(
        conversation.companyId,
        text,
        conversation
    );
    console.timeEnd("Gemini Response");

    if (reply.includes("[ASK_REPRESENTATIVE]")) {
        activeConversation.awaitingRepresentativeConfirmation = true;
    }

    const cleanReply = reply.replace("[ASK_REPRESENTATIVE]", "").trim();

    await conversationStore.append({
        socket,
        role: "assistant",
        text: reply,
        source: "text",
    });

    socket.send(
        JSON.stringify({
            type: "TEXT",
            text: cleanReply,
        }),
    );
}

module.exports = textRouter;