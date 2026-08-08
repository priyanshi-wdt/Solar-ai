import { useState } from "react";
import ChatWindow from "./ChatWindow";
import "./ChatAssistant.css";
import { useEffect } from "react";
import { MessageCircleMore } from "lucide-react";

export default function ChatAssistant({ company }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowGreeting(true);
      setShowBadge(true);
    }, 1000);

    return () => {
      clearTimeout(showTimer);
    };
  }, []);

  // function handleClick() {
  //   if (isOpen) {
  //     // Tell the parent page to shrink the iframe
  //     window.parent.postMessage(
  //       {
  //         type: "CLOSE_CHAT",
  //       },
  //       "*"
  //     );

  //     setIsOpen(false);
  //   } else {
  //     // Tell the parent page to expand the iframe
  //     window.parent.postMessage(
  //       {
  //         type: "OPEN_CHAT",
  //       },
  //       "*"
  //     );

  //     setIsOpen(true);
  //   }
  // }

  function handleClick() {
    if (isOpen) {
      window.parent.postMessage(
        {
          type: "CLOSE_CHAT",
        },
        "*",
      );

      setIsOpen(false);
    } else {
      window.parent.postMessage(
        {
          type: "OPEN_CHAT",
        },
        "*",
      );

      setShowGreeting(false);
      setShowBadge(false);

      setIsOpen(true);
    }
  }

  return (
    <>
      <div className="chat-widget">
        {showGreeting && !isOpen && company && (
          <div className="chat-greeting">
            Hi! I'm {company.receptionistName}, {company.companyName} AI assistant. How can I help you today?
          </div>
        )}

        <button
          className="chat-button"
          onClick={handleClick}
        >
          {/* 💬 */}
          <MessageCircleMore color="white" size={40} strokeWidth={2.5} />

          {showBadge && !isOpen && (
            <span className="chat-badge">1</span>
          )}
        </button>
      </div>

      {isOpen && (
        <ChatWindow
          onClose={() => {
            window.parent.postMessage(
              {
                type: "CLOSE_CHAT",
              },
              "*"
            );

            setIsOpen(false);
          }}
        />
      )}
    </>
  );
}
