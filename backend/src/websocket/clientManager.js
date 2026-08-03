class ClientManager {
  constructor() {
    this.clients = new Set();

    // Active conversations
    this.conversations = new Map();

    // representativeId -> representative socket
    this.representatives = new Map();
  }

  add(socket) {
    this.clients.add(socket);

    console.log(`✅ Client connected (${this.clients.size})`);
  }

  remove(socket) {
    this.clients.delete(socket);

    if (socket.representativeId) {
      this.representatives.delete(socket.representativeId);
    }

    console.log(`❌ Client disconnected (${this.clients.size})`);
  }


  registerRepresentative(repId, socket) {
    socket.representativeId = repId;

    this.representatives.set(repId, socket);

    console.log(`🎧 Representative Registered: ${repId}`);
  }

  getRepresentative(repId) {
    return this.representatives.get(repId);
  }

  has(socket) {
    return this.clients.has(socket);
  }

  count() {
    return this.clients.size;
  }

  broadcast(data) {
    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    }
  }


  createConversation(conversationId, socket, companyId) {
  this.conversations.set(conversationId, {
    conversationId,
    companyId,

    userSocket: socket,
    representativeSocket: null,

    status: "AI",

    awaitingRepresentativeConfirmation: false,
  });

  console.log("💬 Conversation Registered:", conversationId);
}

  getConversation(conversationId) {
    return this.conversations.get(conversationId);
  }

  updateConversation(conversationId, data) {
    const conversation = this.conversations.get(conversationId);

    if (!conversation) return;

    Object.assign(conversation, data);
  }

  removeConversation(conversationId) {
    this.conversations.delete(conversationId);
  }

  getWaitingConversations() {
    return [...this.conversations.values()].filter(
      (c) => c.status === "WAITING",
    );
  }

  setWaiting(conversationId) {
  const conversation = this.conversations.get(conversationId);

  if (!conversation) return;

  conversation.status = "WAITING";

  console.log("🟡 Waiting for Representative:", conversationId);
}
}

module.exports = new ClientManager();
