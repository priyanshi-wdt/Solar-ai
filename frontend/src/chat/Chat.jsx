import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import "./chat.css";
import ChatTyping from "./ChatTyping";

const API = "https://solar-ai-ufc1.onrender.com/api/chat";

export default function Chat({ companyId }) {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
  startConversation();
}, []);

  async function sendMessage(text) {
    if (!text.trim()) return;

    const userMessage = {
      role: "user",
      text,
    };

    const history = [...messages, userMessage];

    setMessages(history);
    setLoading(true);

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          companyId,
          message: text,
          history,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="chat-window">
      <div className="chat-header">Kristin</div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}

        {loading && (
          <ChatTyping
          />
        )}

        <div ref={bottomRef}></div>
      </div>

      <ChatInput onSend={sendMessage} loading={loading} />
    </div>
  );
}
