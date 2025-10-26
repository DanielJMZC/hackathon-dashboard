import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.AI_API_KEY});
const MISSION_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    advice: { type: "string" },
    missions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          category: {
            type: "string",
            enum: ["savings", "investment", "budgeting", "debt", "other"]
          },
          difficulty: {
            type: "string",
            enum: ["easy", "medium", "hard"]
          },
          xp: { type: "number" }
        },
        required: ["name", "description", "category", "difficulty", "xp"]
      }
    }
  },
  required: ["advice", "missions"]
};

export async function getUserQuests(userMessage) {
   const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userMessage,
    config: {
      systemInstruction: "You are a friendly finance AI for a gamified app. Your job is to provide financial advice and create quests with a name and description. Keep responses in JSON format. Always avoid duplicates. Do not stray from the format name and description. Any messages to the user do it under the name advice. Use low XP since xp needed for level up is 100/250/450 range",
      responseMimeType: "application/json",
      responseSchema: MISSION_RESPONSE_SCHEMA
    },
  });
  
    const parsed = JSON.parse(response.text);
    console.log(parsed);
    return parsed;
}