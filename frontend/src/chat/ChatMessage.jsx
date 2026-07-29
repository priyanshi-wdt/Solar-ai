export default function ChatMessage({ message }) {
  return (
    <div
      className={
        message.role === "user"
          ? "message user-message"
          : "message ai-message"
      }
    >
      {message.text}
    </div>
  );
}