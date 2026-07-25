const express = require("express");
const cors = require("cors");

const app = express();

app.get("/gemini-test", (req, res) => {
  res.json({
    message: "Gemini Live connection started",
  });
});

app.use(cors());

app.use(express.json());

module.exports = app;
