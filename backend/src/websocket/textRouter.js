const Conversation = require("../models/Conversation");
const conversationStore = require("../services/conversationStore");
const clientManager = require("./clientManager");
const geminiChatService = require("../services/geminiChat.service");
const {
  startInactivityTimers,
  clearInactivityTimers,
} = require("../utils/inactivityManager");

async function textRouter(socket, data) {
  switch (data.type) {
    case "START_CHAT":
      await startChat(socket);
      break;

    case "TEXT":
      await sendMessage(socket, data.text);
      break;

    case "END_CHAT":
      console.log("🔴 END_CHAT received");
      await endChat(socket);
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
  startInactivityTimers(socket, endChat);
}

async function sendMessage(socket, text) {
  const conversationId = conversationStore.getSessionId(socket);
  const activeConversation = clientManager.getConversation(conversationId);

  if (activeConversation.status === "AI") {
  startInactivityTimers(socket, endChat);
}

  // Customer is already connected to a representative
  if (activeConversation.status === "REPRESENTATIVE") {
    const representativeSocket = activeConversation.representativeSocket;

    if (representativeSocket && representativeSocket.readyState === 1) {
      representativeSocket.send(
        JSON.stringify({
          type: "CUSTOMER_MESSAGE",
          conversationId,
          text,
        }),
      );
    }

    // Save customer message
    await conversationStore.append({
      socket,
      role: "user",
      text,
      source: "text",
    });

    return;
  }

  // Customer is already waiting for a representative
  if (activeConversation.status === "WAITING") {
    socket.send(
      JSON.stringify({
        type: "WAITING_FOR_REPRESENTATIVE",
        text: "Please wait while we connect you with a representative.",
      }),
    );

    return;
  }

  // Check if AI is waiting for representative confirmation
  // if (activeConversation.awaitingRepresentativeConfirmation) {
  //   if (isPositiveResponse(text)) {
  //     activeConversation.awaitingRepresentativeConfirmation = false;

  //     activeConversation.status = "WAITING";
  //     activeConversation.waitingSince = new Date();

  //     clientManager.broadcastToRepresentatives({
  //       type: "NEW_WAITING_CONVERSATION",
  //       conversationId,
  //       companyId: activeConversation.companyId,
  //     });

  //     console.log("📨 Customer requested representative:", conversationId);
  //     await Conversation.updateOne(
  //       { sessionId: conversationId },
  //       {
  //         status: "waiting",
  //       },
  //     );

  //     socket.send(
  //       JSON.stringify({
  //         type: "WAITING_FOR_REPRESENTATIVE",
  //         text: "Please wait while we connect you with a representative.",
  //       }),
  //     );

  //     console.log("🟡 Waiting for representative:", conversationId);

  //     return;
  //   }

  //   // User said no
  //   activeConversation.awaitingRepresentativeConfirmation = false;
  // }

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

  // console.time("Gemini Response");

  // const reply = await geminiChatService.sendMessage(
  //   conversation.companyId,
  //   text,
  //   conversation,
  // );
  // console.timeEnd("Gemini Response");

  // let reply;

  // if (process.env.USE_MOCK_AI === "true") {
  //   console.time("Mock Response");

  //   reply = await generateMockReply(conversationId, text);

  //   console.timeEnd("Mock Response");
  // } else {
    console.time("Gemini Response");

   const reply = await geminiChatService.sendMessage(
      conversation.companyId,
      text,
      conversation,
    );

    console.timeEnd("Gemini Response");
  // }

  if (reply.includes("[ASK_REPRESENTATIVE]")) {
    activeConversation.awaitingRepresentativeConfirmation = true;
  }

  if (reply.includes("[CONNECT_REPRESENTATIVE]")) {
    activeConversation.awaitingRepresentativeConfirmation = false;
    activeConversation.status = "WAITING";

    activeConversation.waitingSince = new Date();
    clearInactivityTimers(socket);
    activeConversation.waitingSince = new Date();z

    clientManager.broadcastToRepresentatives({
      type: "NEW_WAITING_CONVERSATION",
      conversationId,
      companyId: activeConversation.companyId,
    });

    await Conversation.updateOne(
      { sessionId: conversationId },
      { status: "waiting" },
    );

    console.log("📨 Customer requested representative:", conversationId);

    socket.send(
      JSON.stringify({
        type: "WAITING_FOR_REPRESENTATIVE",
        text: "Please wait while we connect you with a representative.",
      }),
    );

    return;
  }

  const cleanReply = reply
    .replace("[ASK_REPRESENTATIVE]", "")
    .replace("[CONNECT_REPRESENTATIVE]", "")
    .trim();

  await conversationStore.append({
    socket,
    role: "assistant",
    text: cleanReply,
    source: "text",
  });

  socket.send(
    JSON.stringify({
      type: "TEXT",
      text: cleanReply,
    }),
  );
}

async function endChat(socket) {

  clearInactivityTimers(socket);
  const conversationId = conversationStore.getSessionId(socket);

  const conversation = clientManager.getConversation(conversationId);

  if (!conversation) return;

  // Notify representative if connected
  if (
    conversation.representativeSocket &&
    conversation.representativeSocket.readyState === 1
  ) {
    conversation.representativeSocket.send(
      JSON.stringify({
        type: "CUSTOMER_DISCONNECTED",
        conversationId,
        text: "The customer has ended the conversation.",
      }),
    );
  }

  await conversationStore.end(socket);

  clientManager.removeConversation(conversationId);
}

module.exports = textRouter;
