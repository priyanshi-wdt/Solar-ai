// import { useEffect, useState } from "react";
// import "./ChatAssistant.css";
// import { companyId } from "../../config/company";
// // import { startChat, sendChatMessage } from "../../services/chat";
// import { useRef } from "react";
// import ChatTyping from "./ChatTyping";
// import { connectTextSocket, sendTextMessage } from "../../services/textSocket";

// const API_URL = "https://solar-ai-ufc1.onrender.com";

// export default function ChatWindow({ onClose }) {
//   const [conversationId, setConversationId] = useState(null);
//   // const [messages, setMessages] = useState([]);
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       role: "assistant",
//       text: "Hi! I'm Kristin.",
//     },
//     {
//       id: 2,
//       role: "user",
//       text: "Hello",
//     },

//     {
//       id: 3,
//       role: "assistant",
//       text: "I'm here to help with your solar questions.",
//     },
//     {
//       id: 4,
//       role: "assistant",
//       text: "You can ask me about solar panels, pricing, installation, batteries, or financing.",
//     },
//     {
//       id: 5,
//       role: "user",
//       text: "Hello i want to know solar installation",
//     },
//     {
//       id: 6,
//       role: "assistant",
//       text: "Okay",
//     },
//   ]);

//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const messagesEndRef = useRef(null);
//   // useEffect(() => {
//   //   // startConversation();
//   // }, []);

//   useEffect(() => {
//     async function connect() {
//       await connectTextSocket();

//       // Send a test message after connecting
//       sendTextMessage("Hello Backend");
//     }

//     connect();
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages]);

//   async function startConversation() {
//     setLoading(true);

//     try {
//       // const data = await startChat();

//       // if (data.success) {
//       //   setConversationId(data.conversationId);

//       //   setMessages([
//       //     {
//       //       role: "assistant",
//       //       text: data.greeting,
//       //     },
//       //   ]);
//       // }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // async function sendMessage() {
//   //   if (!input.trim()) return;

//   //   if (!conversationId) {
//   //     console.error("Conversation not started.");
//   //     return;
//   //   }

//   //   const userMessage = input.trim();

//   //   // Show user's message immediately
//   //   setMessages((prev) => [
//   //     ...prev,
//   //     {
//   //       role: "user",
//   //       text: userMessage,
//   //     },
//   //   ]);

//   //   // Clear input
//   //   setInput("");

//   //   setLoading(true);

//   //   try {
//   //     const data = await sendChatMessage(conversationId, userMessage);

//   //     if (data.success) {
//   //       setMessages((prev) => [
//   //         ...prev,
//   //         {
//   //           role: "assistant",
//   //           text: data.reply,
//   //         },
//   //       ]);
//   //     } else {
//   //       setMessages((prev) => [
//   //         ...prev,
//   //         {
//   //           role: "assistant",
//   //           text: data.message || "Something went wrong.",
//   //         },
//   //       ]);
//   //     }
//   //   } catch (err) {
//   //     console.error(err);

//   //     setMessages((prev) => [
//   //       ...prev,
//   //       {
//   //         role: "assistant",
//   //         text: "Unable to contact the server.",
//   //       },
//   //     ]);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }

//   function handleKeyDown(e) {
//     if (e.key === "Enter") {
//       // sendMessage();
//     }
//   }

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         <span>Kristin</span>

//         <button onClick={onClose}>✕</button>
//       </div>

//       <div className="chat-body">
//         {messages.map((msg, index) => (
//           <div key={index} className={`chat-message ${msg.role}`}>
//             {msg.text}
//           </div>
//         ))}

//         {loading && <ChatTyping />}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="chat-input">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />

//         <button onClick={() => { }} disabled={loading}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import "./ChatAssistant.css";
import ChatTyping from "./ChatTyping";

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
      console.log('mess',messages);
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
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  console.log('mee',messages);
  

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>Kristin</span>

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
