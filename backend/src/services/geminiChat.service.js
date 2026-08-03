const { GoogleGenAI } = require("@google/genai");
const buildPrompt = require("../prompts/buildPrompt");
const { getCompany } = require("./companyService");
const isBusinessOpen = require("../utils/isBusinessOpen");

const MODEL = "gemini-3.5-flash";

class GeminiChatService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async sendMessage(companyId, message, conversation) {
    const company = await getCompany(companyId);

    if (!company) {
      throw new Error(`Company not found: ${companyId}`);
    }

    const representativeAvailable = isBusinessOpen(company);

    const prompt = buildPrompt(
      company,
      representativeAvailable
    );

    const contents = conversation.messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

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


  // async sendMessage(companyId, message, conversation) {
  //   console.time("Total");

  //   console.time("Get Company");
  //   const company = await getCompany(companyId);
  //   console.timeEnd("Get Company");

  //   console.time("Build Prompt");
  //   const representativeAvailable = isBusinessOpen(company);
  //   const prompt = buildPrompt(company, representativeAvailable);
  //   console.log("Prompt Length:", prompt.length);
  //   console.log("Conversation Messages:", conversation.messages.length);
  //   console.timeEnd("Build Prompt");

  //   console.time("Prepare Messages");
  //   const contents = conversation.messages.map((msg) => ({
  //     role: msg.role,
  //     parts: [{ text: msg.text }],
  //   }));

  //   contents.push({
  //     role: "user",
  //     parts: [{ text: message }],
  //   });
  //   console.log(
  //     "Request Size:",
  //     JSON.stringify(contents).length,
  //     "characters"
  //   )
  //   console.timeEnd("Prepare Messages");

  //   console.time("Gemini");
  //   const response = await this.ai.models.generateContent({
  //     model: MODEL,
  //     config: {
  //       systemInstruction: prompt,
  //     },
  //     contents,
  //   });
  //   console.timeEnd("Gemini");

  //   console.timeEnd("Total");

  //   return response.text;
  // }

  // async startConversation(companyId) {
  //   const company = await getCompany(companyId);

  //   if (!company) {
  //     throw new Error(`Company not found: ${companyId}`);
  //   }

  //   const representativeAvailable = isBusinessOpen(company);

  //   const prompt = buildPrompt(company, representativeAvailable);
  //   console.log("Greeting Prompt Length:", prompt.length);

  //   const response = await this.ai.models.generateContent({
  //     model: MODEL,
  //     config: {
  //       systemInstruction: prompt,
  //     },
  //     contents: [
  //       {
  //         role: "user",
  //         parts: [
  //           {
  //             text: "The customer has just connected. Greet them first.",
  //           },
  //         ],
  //       },
  //     ],
  //   });

  //   return response.text;
  // }

  async startConversation(companyId) {
    const company = await getCompany(companyId);

    if (!company) {
      throw new Error(`Company not found: ${companyId}`);
    }

    return `Hello! My name is ${company.receptionistName}. How can I help you today?`;
  }
}

module.exports = new GeminiChatService();
