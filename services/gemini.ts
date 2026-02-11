import dotenv from "dotenv";
import { jsonMlabData } from "./dataLoader.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const MODEL_NAME = "gemini-2.5-flash";
const info = JSON.stringify(jsonMlabData);

export const askGemini = async (
  category: string,
): Promise<string> => {
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("ERROR: API Key not found in environment variables");
    console.error("Make sure VITE_GEMINI_API_KEY is set in your .env file");
    throw new Error(
      "API Key is missing. Check your .env file for VITE_GEMINI_API_KEY",
    );
  }

  const systemInstructions = `
You are an AI assistant for mLab South Africa.
The user just clicked a chip that corresponds to the category they are interested in. The category is: ${category}.
Use the following data to answer questions about ${category}: ${info}
Give them a summary of the information related to the category they selected. Be friendly and professional.
- Keep it very short and concise. Do not use any emojis.
- Ask them what more questions they have`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `${systemInstructions}\n\nUser Message: ${category}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      return "I'm sorry, I couldn't generate a response. Please contact mLab support.";
    }

    return text;
  } catch (error: any) {
    console.error("AI Service Error:", error.message);
    
    if (error.status === 429) {
      return "I'm currently experiencing high demand. Please try again in a few moments, or contact mLab support for assistance.";
    } else if (error.status === 404) {
      return "I'm having trouble connecting to the AI service. Please contact mLab support.";
    } else {
      return "I'm experiencing a connection issue. Please try again in a moment.";
    }
  }
};
