import dotenv from "dotenv";
import { jsonMlabData } from "./dataLoader.js";

dotenv.config();

//Gemini response types
interface GeminiPart {
  text: string;
}

interface GeminiContent {
  parts: GeminiPart[];
}

interface GeminiCandidate {
  content: GeminiContent;
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

const info = JSON.stringify(jsonMlabData);

export async function askGemini(category: string): Promise<string> {
  // Retrieve API key inside the function to ensure it's available at call time
  const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set. Please check your .env file for VITE_GEMINI_API_KEY");
  }
  
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `
            You are an AI assistant for mLab South Africa.
            The user is just clicked a chip that corresponds to the category they  are interested in. the category is: ${category}.
            Use the following data to answer questions about ${category}: ${info}
            Give them a summary of the information related to the category they selected. and be friendly and professional.
            -ask them what more questions they have`,
            },
          ],
        },
      ],
    }),
  });

  // Check response status before parsing JSON
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Gemini API Error (${response.status}):`, errorText);
    return "I'm sorry, I couldn't generate a response. Please contact mLab support.";
  }

  const data = (await response.json()) as GeminiResponse;

  // Extract the text from Gemini's nested response
  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  } else {
    return "I'm sorry, I couldn't generate a response. Please contact mLab support.";
  }
}
