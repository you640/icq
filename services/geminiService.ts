import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize Gemini
// Note: process.env.API_KEY is guaranteed to be available in this environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Map to store active chat sessions per contact ID to maintain history context
const chatSessions: Record<string, Chat> = {};

export const getReplyFromGemini = async (contactName: string, contactId: string, userMessage: string): Promise<string> => {
  try {
    let chat = chatSessions[contactId];

    if (!chat) {
      chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are simulating a user on ICQ in the year 1999. 
          Your screen name is "${contactName}". 
          Use late 90s internet slang (e.g., lol, rofl, brb, gtg, asl, kewl). 
          Do not use modern slang (no "rizz", "bet", "cap").
          Keep your responses relatively short, casual, and chatty. 
          You are chatting with an old friend. 
          Typing style: lowercase often, maybe some multiple exclamation marks!!!
          If asked for ASL, make up a persona from the 90s.`,
          temperature: 0.8,
        },
      });
      chatSessions[contactId] = chat;
    }

    const response: GenerateContentResponse = await chat.sendMessage({ message: userMessage });
    return response.text || "lol error"; // Fallback
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "(Connection Error: Server timeout)";
  }
};
