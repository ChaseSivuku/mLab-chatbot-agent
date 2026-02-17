import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMlabData } from "./dataLoader.js";

dotenv.config();

const MODEL_NAME = "gemini-2.5-flash";

export const generateResponse = async (
  userMessage: string,
): Promise<string> => {
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("ERROR: API Key not found in environment variables");
    console.error("Make sure VITE_GEMINI_API_KEY is set in your .env file");
    throw new Error(
      "API Key is missing. Check your .env file for VITE_GEMINI_API_KEY",
    );
  }

  // Fetch live data from the API (cached after first call)
  const mlabData = await getMlabData();
  const data = JSON.stringify(mlabData);

  const systemInstructions = `
    You are an AI assistant for mLab South Africa. 
    Use the following data to answer questions: ${data}.
    
    Rules:
    - If asked about CodeTribe, explain it's a 6-month programme for youth.
    - If asked about applications, mention the requirements (ID, CV, Grade 12).
    - If you do not have the info, say you will ask the team at mlab. and respond with something containing "escalated".
    - Be friendly and human like. And do not use any emojis.
    - You can answer any questions they have about you also but in relation to mlab, not technical questions.
    - The user did not give an email address, so do not ask for one. and do not say you will get back to them via email.
    - If anything is beyond your knowledge, say you will ask the team at mlab. and respond with something containing "escalated".
    - Keep answers concise, friendly and professional.
    - If its incoherent just say you do not understand.
  `;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `${systemInstructions}\n\nUser Message: ${userMessage}`;
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