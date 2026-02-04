import { Request, Response } from 'express';
import { generateResponse } from '../services/aiService.js'; // Added .js

export const handleChatRequest = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const aiReply = await generateResponse(prompt);

    return res.status(200).json({ 
      success: true, 
      reply: aiReply 
    });
  } catch (error) {
    console.error("Route Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};