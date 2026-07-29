const { GoogleGenAI } = require("@google/genai");
const buildPrompt = require("../prompts/buildPrompt");
const { getCompany } = require("./companyService");

const MODEL = "gemini-3-flash-preview";

class GeminiChatService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async sendMessage(companyId, message, history = []) {
    const company = await getCompany(companyId);

    if (!company) {
      throw new Error(`Company not found: ${companyId}`);
    }

    const prompt = buildPrompt(company);

    const contents = [];

    // Add previous chat messages
    for (const msg of history) {
      contents.push({
        role: msg.role,
        parts: [{ text: msg.text }],
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await this.ai.models.generateContent({
      model: MODEL,
      config: {
        systemInstruction: prompt,
      },
      contents,
    });

    return response.text;
  }
}

module.exports = new GeminiChatService();