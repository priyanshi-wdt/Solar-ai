import ChatAssistant from "./components/ChatAssistant/ChatAssistant";
import VoiceAssistant from "./components/VoiceAssistant/VoiceAssistant";

function App() {
  return (
    <div
      style={{
        width: "100%",
        height:"100%",
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
      }}
    >
      <VoiceAssistant />
      <ChatAssistant />
    </div>
  );
}

export default App;
