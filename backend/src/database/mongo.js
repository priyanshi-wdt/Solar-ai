const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set in .env");
  }

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB Connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB Disconnected");
  });

  await mongoose.connect(uri);
}

module.exports = connectDB;
