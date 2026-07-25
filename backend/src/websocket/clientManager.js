class ClientManager {
  constructor() {
    this.clients = new Set();
  }

  add(socket) {
    this.clients.add(socket);

    console.log(`✅ Client connected (${this.clients.size})`);
  }

  remove(socket) {
    this.clients.delete(socket);

    console.log(`❌ Client disconnected (${this.clients.size})`);
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
}

module.exports = new ClientManager();