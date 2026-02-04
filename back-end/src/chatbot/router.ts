import { getGreetingMessage } from "./greeting";
import { askGemini } from "./gemini";

export async function routeMessage(userMessage: string) {
  const msg = userMessage.toLowerCase().trim();

  // Greeting
  if (msg === "hi" || msg === "hello" || msg === "start") {
    return getGreetingMessage();
  }

  // Menu shortcuts
  if (msg === "programmes") {
    return { message: "Fetching programmes for you..." };
  }

  // Gemini fallback (AI brain)
  const aiResponse = await askGemini(`
You are an mLab chatbot assistant.
Only answer questions using mLab data context.
User question: ${userMessage}
  `);

  return {
    message: aiResponse
  };
}
