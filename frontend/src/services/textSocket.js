import { companyId } from "../config/company";

let socket = null;

export function connectTextSocket(onMessage) {
  return new Promise((resolve, reject) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      resolve(socket);
      return;
    }

    socket = new WebSocket(
      `wss://solar-ai-ufc1.onrender.com?companyId=${companyId}&mode=text`
      // `ws://localhost:5000?companyId=${companyId}&mode=text`
    );

    socket.onopen = () => {
      console.log("✅ Text Socket Connected");
      resolve(socket);
    };

    socket.onerror = (err) => {
      console.error(err);
      reject(err);
    };

    socket.onclose = () => {
      console.log("❌ Text Socket Closed");
      socket = null;
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      onMessage?.(message);
    };
  });
}

export function sendTextMessage(text) {
  if (!socket) return;

  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      type: "TEXT",
      text,
    })
  );
}

export function disconnectTextSocket() {
  socket?.close();
}

export function isConnected() {
  return socket && socket.readyState === WebSocket.OPEN;
}


export function startChat() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      type: "START_CHAT",
    })
  );
}