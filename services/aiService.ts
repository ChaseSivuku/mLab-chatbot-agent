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

// Helper function to list available models
const listAvailableModels = async (apiKey: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        headers: {
          "X-goog-api-key": apiKey,
        },
      }
    );
    
    if (!response.ok) {
      console.warn(`⚠️  Could not list models: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    const models = data.models?.map((m: any) => m.name?.replace("models/", "")) || [];
    console.log("📋 Available models:", models);
    return models;
  } catch (error) {
    console.warn("⚠️  Error listing models:", error);
    return [];
  }
};

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
  
  // List available models first
  const availableModels = await listAvailableModels(apiKey);

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

  // Preferred models in order of priority
  const preferredModels = [
    "gemini-2.5-flash",      // Latest stable flash model
    "gemini-2.0-flash",      // Your curl command used this successfully
    "gemini-2.5-pro",        // Latest pro model
    "gemini-1.5-flash",      // Stable and widely available
    "gemini-pro",            // Used in gemini.ts, very stable
    "gemini-1.5-pro",        // Alternative pro model
  ];
  
  // If we got available models, prioritize preferred ones, then add others
  let modelsToTry: string[] = [];
  if (availableModels.length > 0) {
    // Add preferred models that are available (in order)
    for (const preferred of preferredModels) {
      if (availableModels.includes(preferred)) {
        modelsToTry.push(preferred);
      }
    }
    // Add any remaining available models that weren't in preferred list
    for (const model of availableModels) {
      if (!modelsToTry.includes(model)) {
        modelsToTry.push(model);
      }
    }
  } else {
    // Fallback to defaults if ListModels failed
    modelsToTry = preferredModels;
  }

  const maxRetries = 3;
  let lastError: any = null;
  let workingModel: string | null = null;
  let allModelsRateLimited = true;
  let modelsTried: string[] = [];

  // Try each model until one works
  for (const modelName of modelsToTry) {
    modelsTried.push(modelName);
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (attempt === 1 && !workingModel) {
          console.log(`🔄 Trying model: ${modelName}`);
        }

        // Try SDK first
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });
          
          // Create the prompt with system instructions and user message
          const prompt = `${systemInstructions}\n\nUser Message: ${userMessage}`;

          // Generate content
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          if (!text) {
            return "I'm sorry, I couldn't generate a response. Please contact mLab support.";
          }

          // Success! This model works
          if (!workingModel) {
            workingModel = modelName;
            console.log(`✅ Successfully using model: ${modelName} (via SDK)`);
          }

          return text;
        } catch (sdkError: any) {
          // If SDK fails with 404, try raw fetch (like your curl command)
          if (sdkError.status === 404) {
            console.log(`   SDK failed (404), trying raw fetch API for ${modelName}...`);
            
            // Use raw fetch with v1beta API (like your curl command)
            const fetchUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
            const fetchResponse = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
                "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemInstructions}\n\nUser Message: ${userMessage}`,
                },
              ],
            },
          ],
        }),
            });

            if (!fetchResponse.ok) {
              throw new Error(`Fetch API returned ${fetchResponse.status}: ${await fetchResponse.text()}`);
            }

            const fetchResult = await fetchResponse.json();
            
            if (fetchResult.candidates && fetchResult.candidates[0]?.content?.parts?.[0]?.text) {
              const text = fetchResult.candidates[0].content.parts[0].text;
              
              if (!workingModel) {
                workingModel = modelName;
                console.log(`✅ Successfully using model: ${modelName} (via raw fetch)`);
              }
              
              return text;
            } else {
              throw new Error("No text in response");
            }
          } else {
            // Re-throw non-404 errors
            throw sdkError;
          }
        }
      } catch (error: any) {
        lastError = error;
        
        // If it's a 404 (model not found), try next model
        if (error.status === 404) {
          console.warn(`⚠️  Model ${modelName} not available (404), trying next model...`);
          allModelsRateLimited = false; // Not all are rate limited, some are just not found
          break; // Break out of retry loop, try next model
    }

        console.error(`AI Service Error (model: ${modelName}, attempt ${attempt}/${maxRetries}):`, error.message);

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
          console.warn(`⚠️  Rate limit hit (model: ${modelName}, attempt ${attempt}/${maxRetries})`);
          if (quotaFailure?.violations) {
            console.warn(`   Quota violations:`, JSON.stringify(quotaFailure.violations, null, 2));
          }
          console.warn(`   Retrying in ${delaySeconds} seconds...`);
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
            continue; // Retry same model
          } else {
            // Max retries reached for this model - try next model
            console.warn(`⚠️  Model ${modelName} rate limited after ${maxRetries} attempts, trying next model...`);
            break; // Break out of retry loop, try next model
          }
        }
        
        // For non-quota/404 errors, try next model
        break;
      }
    }
    
    // If we found a working model but hit rate limits, return error
    if (workingModel && lastError?.status === 429) {
      return "Everything failed. This is the last resort";
    }
  }
  
  // If we get here, all models failed
  console.error("❌ All models failed. Models tried:", modelsTried.join(", "));
  console.error("   Last error:", lastError?.message || "Unknown error");
  
  // Provide specific error message based on what happened
  if (allModelsRateLimited && lastError?.status === 429) {
    return "I'm currently experiencing high demand due to API rate limits across all available models. Please try again in a few moments, or contact mLab support for assistance.";
  } else if (lastError?.status === 404) {
    return "I'm having trouble connecting to the AI service. The available models are not accessible with your current API key. Please contact mLab support.";
  } else {
    return "I'm experiencing a connection issue with my brain. Please try again in a moment.";
  }
};
