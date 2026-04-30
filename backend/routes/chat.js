const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../authMiddleware");
const db = require("../db");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model fallback chain — if one model's quota is exhausted, try the next
const MODEL_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

async function getAIResponse(prompt) {
  for (const modelName of MODEL_CHAIN) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.7,
        },
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const text =
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!text || text.trim().length < 5) {
        throw new Error("Empty response from " + modelName);
      }

      return text;
    } catch (err) {
      console.error(`Model ${modelName} failed:`, err.message?.substring(0, 100));
      // Continue to next model in the chain
    }
  }

  // All models failed
  throw new Error("All models exhausted");
}

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Please enter a message to chat with Vitalis AI." });
    }

    // Fetch user context for personalization (including latest structured vitals)
    let userContext = "";
    try {
      // Get basic profile
      const [users] = await db.promise().query("SELECT full_name, age, activity_level FROM users WHERE id = ?", [userId]);
      let baseProfile = "";
      if (users.length > 0) {
        const { full_name, age, activity_level } = users[0];
        baseProfile = `User Name: ${full_name}, Age: ${age || "N/A"}, Lifestyle: ${activity_level || "N/A"}`;
      }
      
      // Get latest structured vitals snapshot
      const [logs] = await db.promise().query("SELECT vitals_snapshot FROM user_health_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", [userId]);
      let detailedProfile = "";
      if (logs.length > 0 && logs[0].vitals_snapshot) {
        try {
          const snapshot = JSON.parse(logs[0].vitals_snapshot);
          detailedProfile = `\nLatest Vitals: ${JSON.stringify(snapshot)}`;
        } catch (e) {
          console.error("Context parse error:", e);
        }
      }
      userContext = `[USER_PROFILE]: ${baseProfile}${detailedProfile}\n`;
    } catch (err) {
      console.error("Context fetch error:", err);
    }

    // Format conversation history (limit to last 6 messages)
    const formattedHistory = (history || [])
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
      .join("\n");


    const prompt = `
You are Vitalis, a highly professional, empathetic, and knowledgeable health assistant.
${userContext}
Rules:
1. Provide accurate, health-focused advice based on user profile.
2. Be concise but never cut your response short.
3. If unsure, recommend consulting a doctor.
4. Maintain a warm, encouraging tone.
5. ALWAYS finish your sentences.

Conversation so far:
${formattedHistory}

User Question:
${message}

Instructions:
- Give short, personalized advice based on this health profile data.
- Understand context from previous messages and recall details if mentioned.
- Respond naturally and conversationally, like a supportive human coach.
- Use occasional natural phrases like "Got it", "That makes sense", or "I see".
- Avoid robotic, repetitive greetings.
- If the user's message is vague, ask a clarifying follow-up like "Can you tell me a bit more about that?".
- Keep the answer concise but complete (2–4 lines).
- Directly answer the user's question while staying clear and relevant.

Response:
`;

    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 12000)
      );

      const text = await Promise.race([getAIResponse(prompt), timeout]);

      res.json({
        success: true,
        response: text,
      });
    } catch (aiError) {
      console.error("AI Error:", aiError.message);
      res.json({
        success: true,
        response: "Try again in a moment.",
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
