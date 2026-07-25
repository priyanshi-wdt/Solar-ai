// // // const { GoogleGenAI } = require("@google/genai");

// // // const ai = new GoogleGenAI({
// // //   apiKey: process.env.GEMINI_API_KEY,
// // // });

// // // async function generateReply(message) {
// // //   try {
// // //     const response = await ai.models.generateContent({
// // //       model: "models/gemini-2.0-flash",
// // //       contents: message,
// // //     });

// // //     return response.text;
// // //   } catch (error) {
// // //     console.error(error);

// // //     return "Sorry, something went wrong.";
// // //   }
// // // }

// // // module.exports = {
// // //   generateReply,
// // // };

// // async function generateReply(message) {

// //   message = message.toLowerCase();

// //   if (message.includes("hello") || message.includes("hi")) {
// //     return "Hello! Nice to meet you. How can I help you today?";
// //   }

// //   if (message.includes("name")) {
// //     return "I am your AI Voice Assistant.";
// //   }

// //   if (message.includes("solar")) {
// //     return "Solar panels convert sunlight into electricity using photovoltaic cells.";
// //   }

// //   if (message.includes("thank")) {
// //     return "You're welcome! Is there anything else I can help you with?";
// //   }

// //   return "I'm still under development, but I understood what you said.";
// // }

// // module.exports = {
// //   generateReply,
// // };

// const WebSocket = require("ws");

// const API_KEY = process.env.GEMINI_API_KEY;

// const MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025";

// function createGeminiLiveConnection(onMessage) {
//   const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

//   const socket = new WebSocket(url);

//   socket.on("open", () => {
//     console.log("Connected to Gemini Live");

//     socket.send(
//       JSON.stringify({
//         setup: {
//           model: MODEL,

//           generationConfig: {
//             responseModalities: ["AUDIO"],
//           },

//           systemInstruction: {
//             parts: [
//               {
//                 text: "You are a natural human-like voice assistant. Answer briefly and conversationally.",
//               },
//             ],
//           },
//         },
//       }),
//     );
//   });

//   socket.on("message", (data) => {

//     const response = JSON.parse(data.toString());

//     console.log(
//       "Gemini Response:",
//       JSON.stringify(response, null, 2)
//     );

//     if (onMessage) {
//       onMessage(response);
//     }

//   });

//   socket.on("error", (err) => {
//     console.log("Gemini Error:", err.message);
//   });

//   socket.on("close", (code, reason) => {
//     console.log("Gemini Closed:", code, reason.toString());
//   });

//   return socket;
// }

// module.exports = {
//   createGeminiLiveConnection,
// };
