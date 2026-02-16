import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const MODEL_NAME = "gemini-2.5-flash";

const ENDPOINTS = [
  "https://mlab-knowledge-api.vercel.app/api/eligibility/c76a6628-455f-4afa-9fba-6125f6ff7c40",
  "https://mlab-knowledge-api.vercel.app/api/application-process/c76a6628-455f-4afa-9fba-6125f6ff7c40",
  "https://mlab-knowledge-api.vercel.app/api/curriculum/c76a6628-455f-4afa-9fba-6125f6ff7c40",
  "https://mlab-knowledge-api.vercel.app/api/schedules/c76a6628-455f-4afa-9fba-6125f6ff7c40",
  "https://mlab-knowledge-api.vercel.app/api/financial-breakdown/c76a6628-455f-4afa-9fba-6125f6ff7c40",
  "https://mlab-knowledge-api.vercel.app/api/faqs",
  "https://mlab-knowledge-api.vercel.app/api/policies",
  "https://mlab-knowledge-api.vercel.app/api/locations",
  "https://mlab-knowledge-api.vercel.app/api/partners",
  "https://mlab-knowledge-api.vercel.app/api/overview",
];

export const askGemini = async (category: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in .env");
  }

  try {
    const responses = await Promise.all(
      ENDPOINTS.map(async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed: ${url}`);
        return res.json();
      })
    );

    const knowledgeBase = JSON.stringify(responses);

    const prompt = `
You are an AI assistant for mLab South Africa.

The user selected this category: "${category}"

Below is the official mLab knowledge base data:
${knowledgeBase}

Instructions:
- Only summarise info relevant to the selected category
- Keep it very short and professional
- No emojis
- End by asking what else they’d like to know
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text || "I couldn’t generate a response right now.";
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Gemini Error:", errorMessage);

    if (error instanceof Error && "status" in error && error.status === 429) {
      return "High demand right now. Please try again shortly.";
    }

    return "I'm experiencing a temporary connection issue. Please try again.";
  }
};
