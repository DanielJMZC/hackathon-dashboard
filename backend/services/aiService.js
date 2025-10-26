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
  try {
    // Get conversation history
    const history = await getConversationHistory(userId);

    // Map history to AI chat format
    const chats = history.map(msg => {
      let content;
      try {
        content = typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
      } catch {
        content = msg.content; // fallback if parsing fails
      }
      return { role: msg.role, parts: [{ text: content.text || JSON.stringify(content) }] };
    });

    // Call Gemini AI
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      history: chats,
      config: {
        systemInstruction: `
          You are a friendly gamified finance AI:
          provide financial advice under 'advice' and create only one mission at a time
          in strict JSON with fields name, description, category (savings, investment, budgeting, debt, other),
          difficulty (easy, medium, hard), xp (low, considering level-up 100/250/450),
          gold, expiration date and never duplicate missions, use history to avoid repetition,
          do not stray from this format, be unique with every quest,
          and start with short-term (one-day) quests before progressing to longer-term missions.
          The expiration date MUST be in the future, starting from today's date in October 2025.
        `,
        responseMimeType: "application/json",
        responseSchema: MISSION_RESPONSE_SCHEMA
      },
    });

    console.log("RAW AI RESPONSE:", response);

    // Attempt to parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(response.text);
    } catch (err) {
      console.warn("AI response is not valid JSON, trying to extract object...");
      const match = response.text.match(/\{.*\}/s);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Failed to parse AI response");
    }

    console.log("PARSED AI RESPONSE:", parsed);

    // Check for missions
    if (!parsed.missions || parsed.missions.length === 0) {
      throw new Error("AI returned no missions");
    }

    return parsed;

  } catch (err) {
    console.error("Error in getUserQuests:", err);
    throw err; // rethrow so the controller can return 500
  }
}

export async function sendMessage(userId, userMessage) {
  await saveMessage(userId, "user", { text: userMessage });

  const aiResponse = await getUserQuests(userId, userMessage);

  await saveMessage(userId, "assistant", aiResponse);

  return await acceptMission(userId, aiResponse);
}

export async function acceptMission(userId, aiResponse) {
    const mission = aiResponse.missions[0];

    const expirationDate = new Date(mission.expiration);

    console.log("Mission XP:", mission.xp, "Gold:", mission.gold);

  const savedMission = await createMission(
    userId,
    mission.description,
    Math.floor(Number(mission.xp) || 0),   
    Math.floor(Number(mission.gold) || 0),                
    mission.name,
    expirationDate,
    mission.difficulty,
    mission.category
  );

  return {
        id: savedMission.insertId || null, 
        name: mission.name,
        description: mission.description,
        xp: Math.floor(Number(mission.xp) || 0),
        gold: Math.floor(Number(mission.gold) || 0),
        difficulty: mission.difficulty,
        category: mission.category,
        expiration: mission.expiration
    };

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
