const clientManager = require("./clientManager");
const Conversation = require("../models/Conversation");
const conversationStore = require("../services/conversationStore");

async function representativeRouter(socket, data) {
  switch (data.type) {
    case "REGISTER_REPRESENTATIVE":
      registerRepresentative(socket, data);
      break;

    case "ACCEPT_CONVERSATION":
      await acceptConversation(socket, data);
      break;

    case "REPRESENTATIVE_MESSAGE":
    await sendRepresentativeMessage(socket, data);
    break;

    case "GET_WAITING_CONVERSATIONS":
    getWaitingConversations(socket);
    break;

    default:
      console.log("Unknown representative message:", data);
  }
}

function registerRepresentative(socket, data) {
  clientManager.registerRepresentative(data.repId, socket);

  socket.send(
    JSON.stringify({
      type: "REGISTERED",
    })
  );
}

async function acceptConversation(socket, data) {
  const { conversationId } = data;

  const conversation =
    clientManager.acceptConversation(
      conversationId,
      socket
    );

  if (!conversation) {
    socket.send(
      JSON.stringify({
        type: "ERROR",
        text: "Conversation not found.",
      })
    );
    return;
  }

  await conversationStore.append({
    conversationId,
    role: "assistant",
    text,
    source: "representative",
});

  // Notify customer
  conversation.customerSocket.send(
    JSON.stringify({
      type: "REPRESENTATIVE_CONNECTED",
      text: "You are now connected with a representative.",
    })
  );

  socket.send(
    JSON.stringify({
      type: "CONNECTED",
      conversationId,
    })
  );

  console.log(
    "🟢 Representative connected:",
    conversationId
  );
}


async function sendRepresentativeMessage(socket, data) {
    const { conversationId, text } = data;

    const conversation =
        clientManager.getConversation(conversationId);

    if (!conversation) return;

    // Save message in MongoDB
    await Conversation.updateOne(
        { sessionId: conversationId },
        {
            $push: {
                messages: {
                    role: "assistant",
                    text,
                    source: "representative",
                    timestamp: new Date(),
                },
            },
        }
    );

    // Send message to customer
    conversation.customerSocket.send(
        JSON.stringify({
            type: "TEXT",
            text,
        })
    );
}

function getWaitingConversations(socket) {
    const conversations = clientManager.getWaitingConversations();

    socket.send(
        JSON.stringify({
            type: "WAITING_CONVERSATIONS",
            conversations: conversations.map(c => ({
                conversationId: c.conversationId,
                companyId: c.companyId,
                waitingSince: c.waitingSince,
            })),
        })
    );
}

module.exports = representativeRouter;