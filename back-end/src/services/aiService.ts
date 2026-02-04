import * as fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Initialize dotenv at the very top
dotenv.config();

// Interface matching your mlabData.json structure
interface MlabData {
  mlab: {
    programmes: Array<{
      id: string;
      name: string;
      description: string;
      duration: string;
      eligibility?: string;
      applications?: any;
      skills_trained?: string[];
      locations?: any;
    }>;
  };
}

// Load your config data safely
const configPath = path.resolve(__dirname, '../config/mlabData.json');
let agentData: MlabData;

try {
  const rawData = fs.readFileSync(configPath, 'utf-8');
  agentData = JSON.parse(rawData);
} catch (err) {
  console.error("Critical Error: Could not find or read mlabData.json at", configPath);
  throw err;
}

export const generateResponse = async (userMessage: string): Promise<string> => {
  // Use the specific key name you mentioned
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Check your .env file for VITE_GEMINI_API_KEY");
  }

  // Format the data for the AI context
  const context = JSON.stringify(agentData.mlab.programmes);

  const systemInstructions = `
    You are an AI assistant for mLab South Africa. 
    Use the following data to answer questions: ${context}.
    
    Rules:
    - If asked about CodeTribe, explain it's a 6-month programme for youth.
    - If asked about applications, mention the requirements (ID, CV, Grade 12).
    - If the info isn't in the data, tell them to email support@mlab.co.za.
    - Keep answers concise and professional.
  `;

  try {
    // Gemini API Request
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemInstructions}\n\nUser Message: ${userMessage}`
          }]
        }]
      })
    });

    const result = await response.json();

    // Check for API-side errors
    if (result.error) {
      console.error("Gemini API Error:", result.error.message);
      return "I'm experiencing a connection issue with my brain. Please try again in a moment.";
    }

    // Extract the text from Gemini's nested response
    if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    } 
    
    return "I'm sorry, I couldn't generate a response. Please contact mLab support.";

  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Failed to connect to AI provider");
  }
};