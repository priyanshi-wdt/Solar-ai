import { useState } from "react";
import ChatWindow from "./ChatWindow";
import "./ChatAssistant.css";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
  if (isOpen) {
    // Tell the parent page to shrink the iframe
    window.parent.postMessage(
      {
        type: "CLOSE_CHAT",
      },
      "*"
    );

    setIsOpen(false);
  } else {
    // Tell the parent page to expand the iframe
    window.parent.postMessage(
      {
        type: "OPEN_CHAT",
      },
      "*"
    );

    setIsOpen(true);
  }
}

  return (
    <>
      <button
        className="chat-button"
        onClick={handleClick}
      >
        💬
      </button>

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