// import { useEffect } from "react";
// import useConversation from "../../hooks/useConversation";

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
import Kristin from "../../assets/images/Kristin.jpg";

export default function VoiceAssistant({ company }) {
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
  const [showGreeting, setShowGreeting] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showVoice, setShowVoice] = useState(true);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowGreeting(true);
      setShowBadge(true);
    }, 1000);

    return () => {
      clearTimeout(showTimer);
    };
  }, []);

  useEffect(() => {
    function handleMessage(event) {

      if (event.data?.type === "VOICE_AI_END") {
        endConversation();
      }

      if (event.data?.type === "OPEN_CHAT") {
        setShowVoice(false);
        setShowGreeting(false);
      }

      if (event.data?.type === "CLOSE_CHAT") {
        setShowVoice(true);
        setShowGreeting(true);
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleButtonClick = async () => {
    if (started) {
      endConversation();
      return;
    }

    setLoading(true);

    try {
      await startConversation();
      setShowGreeting(false);
      setShowBadge(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <>
    //   {showVoice &&
    //     <div className="chat-widget">

    //       {/* Floating Button */}
    //       <button
    //         onClick={handleButtonClick}
    //         className={`voice-button ${speaking ? "ai-speaking" : ""}`}
    //       >
    //         {showBadge && <span className="voice-badge">1</span>}
    //         {loading ? (
    //           <div className="loader" />
    //         ) : speaking ? (
    //           // AI is talking
    //           <>
    //             {speaking && <span className="ring"></span>}

    //             <img src={Kristin} className="avatar" />
    //           </>
    //         ) : listening ? (
    //           // User is talking
    //           <div className="equalizer">
    //             <span></span>
    //             <span></span>
    //             <span></span>
    //             <span></span>
    //           </div>
    //         ) : (
    //           // Waiting
    //           <svg
    //             width="28"
    //             height="28"
    //             viewBox="0 0 24 24"
    //             fill="none"
    //             stroke="white"
    //             strokeWidth="2"
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //           >
    //             <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    //             <path d="M19 10a7 7 0 0 1-14 0" />
    //             <path d="M12 19v4" />
    //             <path d="M8 23h8" />
    //           </svg>
    //         )}
    //       </button>
    //       {showGreeting && showVoice && company && (
    //         <div className="voice-greeting">
    //           Hi! I'm {company.receptionistName}, {company.companyName} AI
    //           assistant. How can I help you today?
    //         </div>
    //       )}
    //     </div>
    //   }

    // </>
    <>
      <div className="voice-widget">
        {showVoice && (
          <>
            <button
              onClick={handleButtonClick}
              className={`voice-button ${speaking ? "ai-speaking" : ""}`}
            >
              {showBadge && <span className="voice-badge">1</span>}

              {loading ? (
                <div className="loader" />
              ) : speaking ? (
                <>
                  <span className="ring"></span>
                  <img src={Kristin} className="avatar" />
                </>
              ) : listening ? (
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

            {showGreeting && showVoice &&  company && (
              <div className="voice-greeting">
                Hi! I'm {company.receptionistName}, {company.companyName} AI
                assistant. How can I help you today?
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
