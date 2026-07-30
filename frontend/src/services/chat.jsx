import { companyId } from "../config/company";

const API_URL = "https://solar-ai-ufc1.onrender.com";

// Start a new chat conversation
export async function startChat() {
  const res = await fetch(`${API_URL}/api/chat/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      companyId,
    }),
  });

  return res.json();
}

// Send a chat message
export async function sendChatMessage(conversationId, message) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversationId,
      message,
    }),
  });

  return res.json();
}