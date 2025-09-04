import { GoogleGenAI, Chat } from "@google/genai";

let chat: Chat | null = null;
export let initError: string | null = null;

try {
  // FIX: Switched from import.meta.env.VITE_API_KEY to process.env.API_KEY to resolve the TypeScript error and align with @google/genai guidelines.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a helpful and friendly AI assistant for a developer named "Somali Programmer". Be concise, helpful, and provide code examples when relevant.',
    },
  });
} catch (e) {
    const message = e instanceof Error ? e.message : "An unknown error occurred during initialization.";
    initError = message;
    console.error("Gemini Service Initialization Error:", e);
}


export const streamChatResponse = async (message: string) => {
  if (initError) {
    throw new Error(`Chat service failed to initialize: ${initError}`);
  }
  if (!chat) {
    throw new Error("Chat service is not available.");
  }

  try {
    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini API:", error);
    
    let userFriendlyMessage = "An unexpected error occurred while communicating with the AI. Please try again later.";
    
    if (error instanceof Error) {
        // Check for specific error messages from the API client
        if (error.message.includes('API key not valid')) {
            userFriendlyMessage = "Authentication Error: Your API key is not valid. Please check your configuration and try again.";
        } else if (error.message.includes('429')) { // Resource exhausted
            userFriendlyMessage = "Rate Limit Exceeded: You've sent too many requests in a short period. Please wait a moment before trying again.";
        } else if (error.message.toLowerCase().includes('fetch failed') || error.message.toLowerCase().includes('network error')) {
            userFriendlyMessage = "Network Error: Could not connect to the AI service. Please check your internet connection.";
        } else if (error.message.includes('INTERNAL') || error.message.includes('500')) {
            userFriendlyMessage = "Server Error: The AI service is currently experiencing issues on its end. Please try again in a few moments.";
        }
    }
    
    throw new Error(userFriendlyMessage);
  }
};
