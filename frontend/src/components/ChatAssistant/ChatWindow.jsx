import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const API = "https://solar-ai-ufc1.onrender.com/api/chat";

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function startConversation() {

  console.log("startConversation called");

    setLoading(true);

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: "abc-solar",
          message: "The customer has just connected. Greet them first.",
          history: [],
        }),
      });

      const data = await response.json();

      setMessages([
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

  async function sendMessage(text) {
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
          companyId: "abc-solar",
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

      <div className="chat-header">
        <span>Chat</span>

        <button onClick={onClose}>✕</button>
      </div>

      <div className="chat-body">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
          />
        ))}

        <div ref={bottomRef}></div>
      </div>

      <ChatInput
        onSend={sendMessage}
        loading={loading}
      />
    </div>
  );
}