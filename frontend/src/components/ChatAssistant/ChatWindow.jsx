import { useEffect, useRef, useState } from "react";
import "./ChatAssistant.css";
import ChatTyping from "./ChatTyping";
import { icon } from "../../config/company";

import {
  connectTextSocket,
  disconnectTextSocket,
  sendTextMessage,
  startChat,
  endChat,
} from "../../services/textSocket";

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Connect WebSocket
  useEffect(() => {
    async function connect() {
      try {
        await connectTextSocket((message) => {
          switch (message.type) {
            case "TEXT":
              setLoading(false);

              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  text: message.text,
                },
              ]);

              break;

            case "WAITING_FOR_REPRESENTATIVE":
              setMessages((prev) => [
                ...prev,
                {
                  role: "system",
                  text: message.text,
                },
              ]);
              break;

            case "REPRESENTATIVE_CONNECTED":
              setMessages((prev) => [
                ...prev,
                {
                  role: "system",
                  text: message.text,
                },
              ]);
              break;

            default:
              console.log(message);
          }
        });

        // Show typing indicator while waiting for AI greeting
        setLoading(true);

        startChat();
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
      console.log("mess", messages);
    }

    connect();

    return () => {
      disconnectTextSocket();
    };
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;

    const text = input.trim();

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text,
      },
    ]);

    setLoading(true);

    sendTextMessage(text);

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  // function handleKeyDown(e) {
  //   if (e.key === "Enter") {
  //     sendMessage();
  //   }
  // }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      sendMessage();
    }

    // Shift + Enter: do nothing
    // The textarea will automatically insert a new line.
  };

  const handleChange = (e) => {
    setInput(e.target.value);

    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };


  return (
    <div className="chat-window">
      {/* <div className="chat-header">
         <img
      src={icon}
      alt="Support"
      className="chat-header-icon"
    />
        <span>Support</span> */}

      <div className="chat-header">
        <div className="chat-header-left">
          <img
            src={icon}
            alt="Support"
            className="chat-header-icon"
          />

          <span>Support</span>
        </div>
        <button
          onClick={() => {
            endChat();

            setTimeout(() => {
              onClose();
            }, 100);
          }}
        >
          ✕
        </button>
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => {
          if (msg.role === "system") {
            return (
              <div key={index} className="system-container">
                <div className="system-message">{msg.text}</div>
              </div>
            );
          }

          return (
            <div key={index} className={`chat-message ${msg.role}`}>
              {msg.text}
            </div>
          );
        })}

        {loading && <ChatTyping />}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          ref={textareaRef}
          placeholder="Type your message..."
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
