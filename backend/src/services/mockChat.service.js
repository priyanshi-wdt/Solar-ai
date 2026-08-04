// const mockReplies = [
//   {
//     keywords: ["hi", "hello", "hey"],
//     reply: "Hi! I'm Kristin. How can I help you today?"
//   },
//   {
//     keywords: ["solar"],
//     reply: "I'd be happy to help with solar. Are you looking to install a new solar system or learn more about solar energy?"
//   },
//   {
//     keywords: ["install"],
//     reply: "Great! Is this installation for your home or your business?"
//   },
//   {
//     keywords: ["home"],
//     reply: "Perfect. Approximately what is your average monthly electricity bill?"
//   },
//   {
//     keywords: ["business"],
//     reply: "Thanks. Approximately what is your monthly electricity bill?"
//   },
//   {
//     keywords: ["100", "200", "300", "400", "500"],
//     reply: "Thanks! Does your roof receive direct sunlight for most of the day?"
//   },
//   {
//     keywords: ["price", "cost", "budget"],
//     reply: "The installation cost depends on your electricity bill, roof size, and equipment. Greg can provide an accurate estimate."
//   },
//   {
//     keywords: ["appointment", "schedule"],
//     reply: "[ASK_REPRESENTATIVE]\n\nWould you like me to connect you with Greg, our solar expert, right now?"
//   },
//   {
//     keywords: ["connect", "representative", "greg", "expert", "human"],
//     reply: "[ASK_REPRESENTATIVE]\n\nWould you like me to connect you with Greg, our solar expert, right now?"
//   },
//   {
//     keywords: ["thank"],
//     reply: "You're welcome! Is there anything else I can help you with today?"
//   },
//   {
//     keywords: ["bye"],
//     reply: "Thank you for contacting us. Have a great day!"
//   }
// ];

// async function generateMockReply(message) {
//   const text = message.toLowerCase();

//   for (const item of mockReplies) {
//     if (item.keywords.some(keyword => text.includes(keyword))) {
//       return item.reply;
//     }
//   }

//   return "Could you tell me a little more so I can better assist you?";
// }

// module.exports = {
//   generateMockReply
// };