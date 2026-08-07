import { useEffect, useRef, useState } from "react";
import "./ChatAssistant.css";
import ChatTyping from "./ChatTyping";
import { icon } from "../../config/company";
import ReactMarkdown from "react-markdown";

import {
  connectTextSocket,
  disconnectTextSocket,
  sendTextMessage,
  startChat,
  endChat,
} from "../../services/textSocket";

export default function ChatWindow({ onClose }) {
  // const [messages, setMessages] = useState([]);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm Kristin, Solar AI assistant. How can I help you today?",
    },
    {
      role: "user",
      text: "Can you tell me the process of solar installation?",
    },
    {
      role: "assistant",
      text: `The solar installation process typically involves a few key steps to ensure everything is customized and safely set up for your property:

1. **Consultation & Custom Design**: We look at your energy history and property layout to design a system tailored to your specific goals.

2. **Permitting & Approvals**: We handle all the paperwork, including local building permits and utility connection approvals, so you don't have to worry about the logistics.

3. **Installation**: Our experienced crew mounts the solar panels, installs the inverters, and connects everything. The actual hands-on installation usually takes just 1 to 2 days.

4. **Inspection & Activation**: Once local inspectors approve the installation, your utility company will grant permission to turn the system on and start generating power.

Are you looking into solar for your home or for a business?`,
    },
    {
      role: "assistant",
      text: "Are you still there?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Connect WebSocket
  useEffect(() => {
    // async function connect() {
    //   try {
    //     await connectTextSocket((message) => {
    //       switch (message.type) {
    //         case "TEXT":
    //           setLoading(false);

    //           setMessages((prev) => [
    //             ...prev,
    //             {
    //               role: "assistant",
    //               text: message.text,
    //             },
    //           ]);

    //           break;

    //         case "WAITING_FOR_REPRESENTATIVE":
    //           setMessages((prev) => [
    //             ...prev,
    //             {
    //               role: "system",
    //               text: message.text,
    //             },
    //           ]);
    //           break;

    //         case "REPRESENTATIVE_CONNECTED":
    //           setMessages((prev) => [
    //             ...prev,
    //             {
    //               role: "system",
    //               text: message.text,
    //             },
    //           ]);
    //           break;

    //         default:
    //           console.log(message);
    //       }
    //     });

    //     // Show typing indicator while waiting for AI greeting
    //     setLoading(true);

    //     startChat();
    //   } catch (err) {
    //     console.error(err);
    //     setLoading(false);
    //   }
    //   console.log("mess", messages);
    // }

    // connect();

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
          <img src={icon} alt="Support" className="chat-header-icon" />

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
              <ReactMarkdown>{msg.text}</ReactMarkdown>
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
