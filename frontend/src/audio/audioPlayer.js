import ConversationManager from "../conversation/conversationManager";

let currentSource = null;
let audioContext = null;

let audioQueue = [];

let isPlaying = false;
let stopped = false;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext({
      sampleRate: 24000,
    });
  }

  return audioContext;
}

export function playPCM(base64PCM) {
  if (!base64PCM) return;

  stopped = false;

  audioQueue.push(base64PCM);

  if (!isPlaying) {
    playNext();
  }
}

function playNext() {

  if (stopped) {
    isPlaying = false;
    return;
  }

  if (audioQueue.length === 0) {
    isPlaying = false;

    if (ConversationManager.turnComplete) {
      ConversationManager.onAIFinished();
    }

    return;
  }

  isPlaying = true;

  const base64PCM = audioQueue.shift();

  const ctx = getAudioContext();

  const binary = atob(base64PCM);

  const pcm = new Int16Array(binary.length / 2);

  for (let i = 0; i < pcm.length; i++) {
    pcm[i] = binary.charCodeAt(i * 2) | (binary.charCodeAt(i * 2 + 1) << 8);
  }

  const float32 = new Float32Array(pcm.length);

  for (let i = 0; i < pcm.length; i++) {
    float32[i] = pcm[i] / 32768;
  }

  const buffer = ctx.createBuffer(1, float32.length, 24000);

  buffer.copyToChannel(float32, 0);

  const source = ctx.createBufferSource();
  currentSource = source;

  source.buffer = buffer;

  source.connect(ctx.destination);

  source.onended = () => {
    playNext();
  };

  source.start();
}

export function stopAudio() {

  stopped = true;

  audioQueue = [];

  if (currentSource) {
    currentSource.onended = null;

    try {
      currentSource.stop();
    } catch { }

    currentSource.disconnect();

    currentSource = null;
  }

  isPlaying = false;

  console.log("🛑 AI Audio Stopped");
}