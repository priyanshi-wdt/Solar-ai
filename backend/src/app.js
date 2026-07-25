const express = require("express");
const cors = require("cors");

// const chatRoutes = require("./routes/chat.routes");

const {createGeminiLiveConnection} =
require("./services/geminiLive.service");

const app = express();

app.get("/gemini-test",(req,res)=>{

    createGeminiLiveConnection();

    res.json({
        message:"Gemini Live connection started"
    });

});

app.use(cors());

app.use(express.json());

// app.use("/api/chat", chatRoutes);

module.exports = app;