// import { useEffect } from "react";
// import useConversation from "../../hooks/useConversation";
// import ChatWindow from "../ChatWindow/ChatWindow";

// export default function VoiceAssistant() {
//   const {
//     started,
//     connected,
//     listening,
//     speaking,
//     messages,
//     startConversation,
//     endConversation,
//   } = useConversation();

//   function getStatus() {
//     if (!connected) return "🔴 Disconnected";
//     if (speaking) return "🔊 AI Speaking...";
//     if (listening) return "🎤 Listening...";
//     return "😴 Waiting...";
//   }

//   // useEffect(() => {
//   //   startConversation();
//   // }, []);

//   useEffect(() => {
//     function handleMessage(event) {
//       if (event.data?.type === "VOICE_AI_END") {
//         endConversation();
//       }
//     }

//     window.addEventListener("message", handleMessage);

//     return () => window.removeEventListener("message", handleMessage);
//   }, []);

//   return (
//     <div
//       style={{
//         maxWidth: "900px",
//         margin: "40px auto",
//         padding: "20px",
//       }}
//     >
//       <h1>Solar Voice AI</h1>

//       <h3>{getStatus()}</h3>

//       {/* {!started && (
//         <button
//           onClick={startConversation}
//           style={{
//             padding: "12px 25px",
//             fontSize: "18px",
//             cursor: "pointer",
//           }}
//         >
//           🎤 Start Conversation
//         </button>
//       )} */}

//       {/* <ChatWindow messages={messages} /> */}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import useConversation from "../../hooks/useConversation";
import "./VoiceAssistant.css";

export default function VoiceAssistant() {
  const {
    started,
    connected,
    listening,
    speaking,
    startConversation,
    endConversation,
  } = useConversation();

  // console.log("list", listening);
  // console.log("spea", speaking);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleMessage(event) {
      if (event.data?.type === "VOICE_AI_END") {
        endConversation();
      }
    }

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleButtonClick = async () => {
    if (started) {
      endConversation();
      return;
    }

    setLoading(true);

    try {
      await startConversation();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleButtonClick}
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          border: "none",
          background: "#ff6b35",
          color: "#fff",
          fontSize: "30px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <div className="loader" />
        ) : started ? (
          <div className="equalizer">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10a7 7 0 0 1-14 0" />
            <path d="M12 19v4" />
            <path d="M8 23h8" />
          </svg>
        )}
      </button>
    </>
  );
}
