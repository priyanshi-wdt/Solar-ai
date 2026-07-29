const { GoogleGenAI } = require("@google/genai");
const conversationStore = require("../services/conversationStore");
// const solarPrompt = require("../prompts/solarPrompt");
const buildPrompt = require("../prompts/buildPrompt");
const { getCompany } = require("../services/companyService");

// NOTE: gemini-live-2.5-flash-preview was retired (shutdown Dec 9, 2025).
// If this model ever stops working, check
// https://ai.google.dev/gemini-api/docs/live-api for the current id.
const MODEL = "gemini-3.1-flash-live-preview";

class GeminiAdapter {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // frontend websocket -> Gemini session
    this.sessions = new Map();

    // frontend websocket -> in-flight connection promise
    this.pending = new Map();

    // frontend websocket -> accumulating transcript text for the
    // current turn (transcription arrives in small chunks, we
    // flush to the DB once on turnComplete instead of once per chunk)
    this.inputBuffers = new Map();
    this.outputBuffers = new Map();
  }

  async create(socket) {
    console.log("🚀 Creating Gemini Live Session...");

    const companyId = socket.companyId || "abc-solar";

    const company = await getCompany(companyId);

    if (!company) {
      throw new Error(`Company not found: ${companyId}`);
    }

    const prompt = buildPrompt(company);
    // Start the DB conversation record before Gemini connects so
    // there's no race between the greeting message and logging it.
    await conversationStore.start({
      socket,
      companyId,
      conversationType: "voice",
    });

    const session = await this.ai.live.connect({
      model: MODEL,

      config: {
        responseModalities: ["AUDIO"],

        // Ask Gemini to also transcribe both sides of the audio
        // conversation as text so we have something to store in
        // Mongo besides raw audio bytes.
        inputAudioTranscription: {},
        outputAudioTranscription: {},

        // speechConfig: {
        //   voiceConfig: {
        //     prebuiltVoiceConfig: {
        //       voiceName: "Puck"
        //     }
        //   }
        // },

        realtimeInputConfig: {
          automaticActivityDetection: {
            disabled: false,
            startOfSpeechSensitivity: "START_SENSITIVITY_HIGH",
            endOfSpeechSensitivity: "END_SENSITIVITY_HIGH",
            silenceDurationMs: 600,
          },
        },
        systemInstruction: prompt,
        //         systemInstruction: `
        // You are ABC Solar's AI Voice Receptionist.

        // Behavior:
        // - Always greet first.
        // - Introduce yourself.
        // - Speak naturally.
        // - Keep responses short.
        // - Ask only one question at a time.
        // - Remember previous answers.
        // - If user interrupts you, immediately stop speaking.
        // - If user says wait, pause until they continue.
        // `,
      },

      callbacks: {
        onopen: () => {
          console.log("✅ Gemini Connected");
        },

        onmessage: async (message) => {
          await this.handleMessage(socket, message);
        },

        onclose: (event) => {
          console.log("❌ Gemini Closed", event?.code, event?.reason);
          this.sessions.delete(socket);
          this.pending.delete(socket);
          this.inputBuffers.delete(socket);
          this.outputBuffers.delete(socket);
        },

        onerror: (err) => {
          console.error("Gemini Error");
          console.error(err);
        },
      },
    });

    this.sessions.set(socket, session);
    console.log("✅ Session Stored");

    // AI greets immediately
    session.sendClientContent({
      turns: [
        {
          role: "user",
          parts: [
            { text: "The customer has just connected. Greet them first." },
          ],
        },
      ],
      turnComplete: true,
    });

    return session;
  }

  async get(socket) {
    if (this.sessions.has(socket)) {
      return this.sessions.get(socket);
    }

    if (this.pending.has(socket)) {
      return this.pending.get(socket);
    }

    const creationPromise = this.create(socket).finally(() => {
      this.pending.delete(socket);
    });

    this.pending.set(socket, creationPromise);

    return creationPromise;
  }

  async sendAudio(socket, pcmBuffer) {
    const session = await this.get(socket);

    session.sendRealtimeInput({
      audio: {
        data: pcmBuffer.toString("base64"),
        mimeType: "audio/pcm;rate=16000",
      },
    });
  }

  async sendText(socket, text) {
    const session = await this.get(socket);

    // Typed messages are already text, log immediately.
    await conversationStore.append(socket, "user", text, "text");

    session.sendClientContent({
      turns: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
      turnComplete: true,
    });
  }

  async signalAudioStreamEnd(socket) {
    const session = this.sessions.get(socket);
    if (!session) return;

    session.sendRealtimeInput({ audioStreamEnd: true });
  }

  async handleMessage(socket, message) {
    if (message.setupComplete) {
      return;
    }

    // User interrupted AI — also means the AI's partial reply for
    // this turn shouldn't be treated as final; drop the buffer.
    if (message.serverContent?.interrupted) {
      this.outputBuffers.delete(socket);
      socket.send(JSON.stringify({ type: "INTERRUPTED" }));
      return;
    }

    // ---------- Live transcripts (voice) ----------
    const inputTranscript = message.serverContent?.inputTranscription?.text;
    if (inputTranscript) {
      const prev = this.inputBuffers.get(socket) || "";
      this.inputBuffers.set(socket, prev + inputTranscript);
    }

    const outputTranscript = message.serverContent?.outputTranscription?.text;
    if (outputTranscript) {
      const prev = this.outputBuffers.get(socket) || "";
      this.outputBuffers.set(socket, prev + outputTranscript);
    }

    const parts = message.serverContent?.modelTurn?.parts || [];

    for (const part of parts) {
      if (part.thought) continue;

      // ---------- TEXT (rare with AUDIO-only responseModalities) ----------
      if (part.text) {
        console.log("🤖", part.text);

        // conversationStore.append(socket, "assistant", part.text, "text");

        socket.send(
          JSON.stringify({
            type: "TEXT",
            text: part.text,
          }),
        );
      }

      // ---------- AUDIO ----------
      if (part.inlineData) {
        socket.send(
          JSON.stringify({
            type: "AUDIO",
            mimeType: part.inlineData.mimeType,
            data: part.inlineData.data,
          }),
        );
      }
    }

    // Turn finished — flush accumulated transcripts to the DB.
    if (message.serverContent?.turnComplete) {
      const userText = this.inputBuffers.get(socket);
      const aiText = this.outputBuffers.get(socket);

      if (userText) {
        await conversationStore.append(socket, "user", userText, "voice");
      }
      if (aiText) {
        await conversationStore.append(socket, "assistant", aiText, "voice");
      }

      this.inputBuffers.delete(socket);
      this.outputBuffers.delete(socket);

      socket.send(JSON.stringify({ type: "TURN_COMPLETE" }));
    }
  }

  async close(socket) {
    const session = this.sessions.get(socket);

    await conversationStore.end(socket);

    if (!session) return;

    console.log("🛑 Closing Gemini Session");

    session.close();

    this.sessions.delete(socket);
    this.pending.delete(socket);
    this.inputBuffers.delete(socket);
    this.outputBuffers.delete(socket);
  }
}

module.exports = new GeminiAdapter();
