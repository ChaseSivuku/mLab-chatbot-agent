// import * as fs from 'fs';
// import path from 'path';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonMlabData } from "./dataLoader.js";

// Initialize dotenv at the very top
dotenv.config();

// Interface matching your mlabData.json structure
// export interface ApplicationInfo {
//   "how_to_apply": string;
// }

// export interface MlabData {
//   mlab: {
//     programmes: Array<{
//       id: string;
//       name: string;
//       description: string;
//       duration: string;
//       eligibility?: string;
//       applications?: any;
//       skills_trained?: string[];
//       locations?: any;
//     }>;
//   };
// }

// Load your config data safely
// const configPath = path.resolve(__dirname, '../config/mlabData.json');
// let agentData: MlabData;

// try {
//   const rawData = fs.readFileSync(configPath, 'utf-8');
//   agentData = JSON.parse(rawData);
// } catch (err) {
//   console.error("Critical Error: Could not find or read mlabData.json at", configPath);
//   throw err;
// }

export const generateResponse = async (
  userMessage: string,
): Promise<string> => {
  // Use the specific key name you mentioned
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ ERROR: API Key not found in environment variables");
    console.error("   Make sure VITE_GEMINI_API_KEY is set in your .env file");
    throw new Error(
      "API Key is missing. Check your .env file for VITE_GEMINI_API_KEY",
    );
  }

  // Format the data for the AI context
  const data = JSON.stringify(jsonMlabData);

  const systemInstructions = `
    You are an AI assistant for mLab South Africa. 
    Use the following data to answer questions: ${data}.
    
    Rules:
    - If asked about CodeTribe, explain it's a 6-month programme for youth.
    - If asked about applications, mention the requirements (ID, CV, Grade 12).
    - If the info isn't in the data, tell them to email support@mlab.co.za.
    - Keep answers concise, friendly and professional.
    - If the question is unclear or outside your knowledge, respond with something containing "escalated".
  `;

  // Retry logic for quota errors
  const maxRetries = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Initialize the Gemini AI client
      const genAI = new GoogleGenerativeAI(apiKey);
      // Using gemini-2.0-flash (matches your curl command - dashboard shows "Gemini 3 Flash" as display name)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Create the prompt with system instructions and user message
      const prompt = `${systemInstructions}\n\nUser Message: ${userMessage}`;

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        return "I'm sorry, I couldn't generate a response. Please contact mLab support.";
      }

      return text;
    } catch (error: any) {
      lastError = error;
      console.error(`AI Service Error (attempt ${attempt}/${maxRetries}):`, error);
      
      // Handle rate limiting errors (429) with retry logic
      if (error.status === 429) {
        // Parse error details to understand what limit was hit
        const errorDetails = error.errorDetails || [];
        const quotaFailure = errorDetails.find(
          (detail: any) => detail["@type"] === "type.googleapis.com/google.rpc.QuotaFailure"
        );
        const retryInfo = errorDetails.find(
          (detail: any) => detail["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
        );
        
        const retryDelay = retryInfo?.retryDelay;
        const delaySeconds = retryDelay 
          ? parseInt(retryDelay.replace("s", "")) || 5 
          : Math.min(attempt * 2, 10); // Exponential backoff: 2s, 4s, 8s
        
        // Log detailed error information
        console.warn(`⚠️  Rate limit hit (attempt ${attempt}/${maxRetries})`);
        if (quotaFailure?.violations) {
          console.warn(`   Quota violations:`, JSON.stringify(quotaFailure.violations, null, 2));
        }
        console.warn(`   Retrying in ${delaySeconds} seconds...`);
        console.warn(`   This is likely a temporary rate limit, not a quota exhaustion.`);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
          continue; // Retry
        } else {
          // Max retries reached - rate limit persists
          return "I'm currently experiencing high demand. This is a temporary rate limit. Please try again in a few moments, or contact mLab support for assistance.";
        }
      }
      
      // For non-quota errors, break and return error message
      break;
    }
  }
  
  // If we get here, all retries failed or it's a non-quota error
  return "I'm experiencing a connection issue with my brain. Please try again in a moment.";
};
