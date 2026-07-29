export default function ChatMessage({ message }) {
  return (
    <div
      className={`chat-message ${
        message.role === "user" ? "user" : "assistant"
      }`}
    >
      {message.text}
    </div>
  );
}