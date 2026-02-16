import { jsonMlabData, logMessage } from "../app.js";
import { generateResponse } from "../aiService.js";
import { askGemini } from "../gemini.js";
import express from "express";
import { logToSupabase } from "../supabaseService.js";

const route = express.Router();

// Endpoint to handle chat messages
route.post("/chat", async (req, res) => {
  //get message from the request
  const { message } = req.body;

  try {
    //calling the aiService generateResponse function
    const answer = await generateResponse(message);

    //message logging and handling escalations
    if (!answer || answer.toLocaleLowerCase().includes("escalated")) {
      logMessage(message, "escalated");
      logToSupabase(message, "escalated");
      return res.json({
        reply:
          "I am sorry but I do not have that information currently. I will pass this query to our mLab team.",
      });
    } else {
      res.json({ reply: answer });
    }
  } catch (error) {
    console.error("Error in /chat endpoint:", error);
    logMessage(message, "error");
    logToSupabase(message, "error");
    return res.status(500).json({
      reply: "I'm experiencing technical difficulties. Please try again later or contact mLab support.",
    });
  }
});

route.post("/category", async (req, res) => {
  const { category } = req.body;

  try {
    // Call askGemini function with category
    const answer = await askGemini(category);
    return res.json({ reply: answer });

  } catch (error) {
    console.error("Error in /category endpoint:", error);
    // logMessage(category, "error");
    // logToSupabase(category, "error");
    return res.status(500).json({
      reply: "I'm experiencing technical difficulties. Please try again later or contact mLab support.",
    });
  }
});

export default route;
