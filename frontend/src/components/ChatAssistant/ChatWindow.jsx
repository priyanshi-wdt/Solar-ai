import { useEffect, useState } from "react";
import "./ChatAssistant.css";
import { companyId } from "../../config/company";
import { startChat, sendChatMessage } from "../../services/chat";
import { useRef } from "react";
import ChatTyping from "./ChatTyping";

const API_URL = "https://solar-ai-ufc1.onrender.com";

export default function ChatWindow({ onClose }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  async function startConversation() {
  try {
    const data = await startChat();

    if (data.success) {
      setConversationId(data.conversationId);

      setMessages([
        {
          role: "assistant",
          text: data.greeting,
        },
      ]);
    }
  } catch (err) {
    console.error(err);
  }
}

  async function sendMessage() {
    if (!input.trim()) return;

    if (!conversationId) {
      console.error("Conversation not started.");
      return;
    }

    const userMessage = input.trim();

    // Show user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    // Clear input
    setInput("");

    setLoading(true);

    try {
      const data = await sendChatMessage(conversationId, userMessage);

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.reply,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.message || "Something went wrong.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to contact the server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>Kristin</span>

        <button onClick={onClose}>✕</button>
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            {msg.text}
          </div>
        ))}


        {loading && <ChatTyping/>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
