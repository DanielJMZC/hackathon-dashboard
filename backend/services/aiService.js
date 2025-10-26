import dotenv from 'dotenv';
import { db } from '../db.js';
import {createMission} from '../models/missionModel.js';
import { Chats, GoogleGenAI } from "@google/genai";
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
          xp: { type: "number" },
          gold: { type: "number" }, // new small reward in gold
          expiration: { type: "string", format: "date-time" } // ISO 8601 date
        },
        required: ["name", "description", "category", "difficulty", "xp", "gold", "expiration"]
      }
    }
  },
  required: ["advice", "missions"]
};


 
export async function getUserQuests(userId, userMessage) {
    const history = await getConversationHistory(userId);

    const chats = history.map(msg => ({
        role: msg.role, // "user" or "assistant"
        parts: [
            { text: msg.content.text || JSON.stringify(msg.content) }
        ]
    }));

   const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userMessage,
    history: chats,
    config: {
      systemInstruction: "You are a friendly gamified finance AI: provide financial advice under advice and create only one mission at a time in strict JSON with fields name, description, category (savings, investment, budgeting, debt,gold, other), difficulty (easy, medium, hard), xp (low, considering level-up 100/250/450), expiration date and never duplicate missions, use history to avoid repetition, do not stray from this format, be unique with every quest, and start with short-term (one-day) quests before progressing to longer-term missions.",
      responseMimeType: "application/json",
      responseSchema: MISSION_RESPONSE_SCHEMA
    },
  });
  
    const parsed = JSON.parse(response.text);
    console.log(parsed);
    return parsed;
}

export async function sendMessage(userId, userMessage) {
  await saveMessage(userId, "user", { text: userMessage });

  const aiResponse = await getUserQuests(userId, userMessage);

  await saveMessage(userId, "assistant", aiResponse);

  return await acceptMission(userId, aiResponse);
}

export async function acceptMission(userId, aiResponse) {
    const mission = aiResponse.missions[0];

    console.log("Mission XP:", mission.xp, "Gold:", mission.gold);

  const savedMission = await createMission(
    userId,
    mission.description,
    Math.floor(Number(mission.xp) || 0),   
    Math.floor(Number(mission.gold) || 0),                
    mission.name,
    mission.expiration,
    mission.difficulty,
    mission.category
  );

  return savedMission;

}

async function saveMessage(userId, role, content) {
    const now = new Date();
    const [result] = await db.query(
        `INSERT INTO aiMessage(user_id, role, content, date) VALUES (?, ?, ?, ?)`,
        [userId, role, JSON.stringify(content), now]
    );
}

export async function getConversationHistory(userId) {
  const [rows] = await db.query (
    `SELECT * FROM aiMessage WHERE user_id = ? ORDER BY date ASC`,
    [userId]
  );

  return rows.map(row => ({
    role: row.role,
    content: row.content
  }));
}
