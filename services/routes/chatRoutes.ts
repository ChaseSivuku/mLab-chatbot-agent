import { jsonMlabData, logMessage } from "../app.js";
import { generateResponse } from "../aiService.js";
import express from "express";

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
      return res.json({
        reply:
          "I will pass this query to our mLab support team and will get back to you via email.",
      });
    } else {
      logMessage(message, "success");
      res.json({ reply: answer });
    }
  } catch (error) {
    console.error("Error in /chat endpoint:", error);
    logMessage(message, "error");
    return res.status(500).json({
      reply: "I'm experiencing technical difficulties. Please try again later or contact mLab support.",
    });
  }
});

route.post("/category", (req, res) => {
  const { category } = req.body;

  //TODO call Thembi's context gemini function with message and jsonData initialize it to "answer" askGemini(message, jsonMlabData)
  const answer = "This is a placeholder category answer"; //replace this line with the gemini function call

  logMessage(category, "category_used");
  return res.json({ reply: answer });
});

export default route;
