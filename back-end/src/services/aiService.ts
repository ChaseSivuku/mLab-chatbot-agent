import * as fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Look up to find the .env in the root (back-end/src/services -> back-end/src -> back-end -> root)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const configPath = path.resolve(__dirname, '../config/mlabData.json');
let agentData: any;

try {
  agentData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  console.log('✅ Successfully loaded mlabData.json');
} catch (err) {
  console.error("❌ Could not read mlabData.json at", configPath);
}

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

export const generateResponse = async (userMessage: string): Promise<string> => {
  try {
    console.log('🚀 Calling Gemini 3 Flash...');
    const context = JSON.stringify(agentData?.mlab?.programmes);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an mLab assistant. Use this data: ${context}
      
      User Question: ${userMessage}
      
      Provide a helpful, professional response.`
    });

    if (response && response.text) {
      console.log('✅ Response received from Gemini 3');
      return response.text;
    }

    return "I processed your request but couldn't generate a text answer.";

  } catch (error: any) {
    console.error("❌ Gemini SDK Error:", error.message);
    return `AI Error: ${error.message}`;
  }
};