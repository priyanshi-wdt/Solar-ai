import { useEffect, useState } from "react";

import ConversationManager from "../conversation/ConversationManager";

import {
  connectWebSocket,
  disconnectWebSocket,
  startSession,
} from "../services/websocket";

import { startWorklet, stopWorklet } from "../audio/worklet";
import { stopAudio } from "../audio/audioPlayer";

export default function useConversation() {

  const [state, setState] = useState(
    ConversationManager.getState()
  );

  useEffect(() => {

    const unsubscribe =
      ConversationManager.subscribe(setState);

    return () => {
      unsubscribe();
    };

  }, []);

  async function startConversation() {

    if (state.started) return;

    try {

      // 1. Connect Backend
      await connectWebSocket();

      // 2. Open Microphone
      await startWorklet();

      // 3. Update State
      ConversationManager.startConversation();

      ConversationManager.setListening(true);

      // 4. Create Gemini Session
      startSession();

    } catch (err) {

      console.error(err);

    }

  }

  function endConversation() {
    stopAudio();                  // Stop AI voice immediately
    stopWorklet();                // Stop microphone
    disconnectWebSocket();        // Disconnect backend

    conversationManager.clearMessages();
    conversationManager.stopConversation();
}

  return {
    ...state,
    startConversation,
    endConversation,
  };

}