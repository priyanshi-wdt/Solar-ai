// const conversationState = new Map();

// async function generateMockReply(conversationId, message) {
//   const text = message.toLowerCase();

//   let state = conversationState.get(conversationId) || "GREETING";

//   switch (state) {
//     case "GREETING":
//       conversationState.set(conversationId, "ASK_INSTALLATION");
//       return "Hi! I'm Kristin. How can I help you today?";

//     case "ASK_INSTALLATION":
//       if (text.includes("solar")) {
//         conversationState.set(conversationId, "OFFER_EXPERT");
//         // return "I'd be happy to help. Is this solar installation for your home or your business?";
//       return "[ASK_REPRESENTATIVE]\n\nBased on the information you've shared, would you like to speak with Greg, our solar expert, right now, or would you prefer to schedule an appointment for later?";

      
//       }
//       return "Could you tell me a little more about what you're looking for?";

//     // case "ASK_PROPERTY":
//     //   if (text.includes("home")) {
//     //     conversationState.set(conversationId, "ASK_BILL");
//     //     return "Great! Approximately what is your monthly electricity bill?";
//     //   }

//     //   if (text.includes("business")) {
//     //     conversationState.set(conversationId, "ASK_BILL");
//     //     return "Great! Approximately what is your monthly electricity bill?";
//     //   }

//     //   return "Is this for your home or your business?";

//     // case "ASK_BILL":
//     //   conversationState.set(conversationId, "ASK_ROOF");
//     //   // return "Thank you. Does your roof receive direct sunlight for most of the day?";
//     //   return "[ASK_REPRESENTATIVE]\n\nBased on the information you've shared, would you like to speak with Greg, our solar expert, right now, or would you prefer to schedule an appointment for later?";

//     // case "ASK_ROOF":
//     //   conversationState.set(conversationId, "ASK_SIZE");
//     //   return "Approximately how large is your roof?";

//     // case "ASK_SIZE":
//     //   conversationState.set(conversationId, "OFFER_EXPERT");
//     //   return "[ASK_REPRESENTATIVE]\n\nBased on the information you've shared, would you like to speak with Greg, our solar expert, right now, or would you prefer to schedule an appointment for later?";

//     case "OFFER_EXPERT":
//       if (
//         text.includes("now") ||
//         text.includes("right now") ||
//         text.includes("today") ||
//         text.includes("talk") ||
//         text.includes("yes") ||
//         text.includes("sure") ||
//         text.includes("okay")
//       ) {
//         conversationState.delete(conversationId);

//         return "[CONNECT_REPRESENTATIVE]\n\nCertainly! I'll connect you with Greg right away.";
//       }

//       conversationState.set(conversationId, "SCHEDULE");

//       return "No problem. Let's schedule an appointment. What day works best for you?";

//     case "SCHEDULE":
//       return "Perfect. Greg will contact you at your preferred time.";

//     default:
//       conversationState.delete(conversationId);
//       return "Could you please repeat that?";
//   }
// }

// module.exports = {
//   generateMockReply,
// };