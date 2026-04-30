const express = require("express");
const router = express.Router();
const authMiddleware = require("../authMiddleware");
const db = require("../db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VEG_PLAN = {
  breakfast: { 
    items: ["Oats with Milk & Nuts", "Poha with Peas & Peanuts", "Moong Dal Chilla", "Upma with Veggies"], 
    calories: 350, protein: 14, carbs: 45, fats: 10 
  },
  lunch: { 
    items: ["Rice, Dal & Bhindi Masala", "2 Rotis, Paneer Bhurji & Salad", "Quinoa Khichdi", "Vegetable Pulao with Raita"], 
    calories: 550, protein: 18, carbs: 70, fats: 15 
  },
  dinner: { 
    items: ["2 Rotis, Dal Fry & Lauki Sabzi", "Sautéed Tofu & Veggies", "Vegetable Dalia", "Masala Oats with Veggies"], 
    calories: 450, protein: 20, carbs: 55, fats: 12 
  },
  snacks: { 
    items: ["Roasted Makhana", "Handful of Nuts", "Fruit Bowl", "Greek Yogurt"], 
    calories: 200, protein: 5, carbs: 30, fats: 8 
  },
  total: { calories: 1550, protein: 57, carbs: 200, fats: 45 }
};

const NON_VEG_PLAN = {
  breakfast: { 
    items: ["Oats with Milk & Nuts", "2 Boiled Eggs with Toast", "Egg Bhurji with Roti", "Chicken Sausage & Toast"], 
    calories: 350, protein: 22, carbs: 35, fats: 12 
  },
  lunch: { 
    items: ["Chicken Curry with Brown Rice", "2 Rotis, Grilled Chicken & Salad", "Fish Curry with Steam Rice", "Egg Curry with 2 Rotis"], 
    calories: 550, protein: 35, carbs: 50, fats: 15 
  },
  dinner: { 
    items: ["Grilled Chicken & Sautéed Veggies", "Fish Tikka with Salad", "Egg Salad with Chickpeas", "Chicken Stew with Bread"], 
    calories: 450, protein: 30, carbs: 40, fats: 15 
  },
  snacks: { 
    items: ["Boiled Egg White", "Chicken Soup", "Handful of Nuts", "Fruit Bowl"], 
    calories: 200, protein: 10, carbs: 20, fats: 8 
  },
  total: { calories: 1450, protein: 97, carbs: 145, fats: 50 }
};

const VEGAN_PLAN = {
  breakfast: { 
    items: ["Oats with Almond Milk & Nuts", "Poha with Peas & Peanuts", "Besan Chilla", "Chia Seed Pudding with Berries"], 
    calories: 320, protein: 12, carbs: 40, fats: 8 
  },
  lunch: { 
    items: ["Brown Rice, Tofu & Broccoli", "Quinoa Khichdi with Veggies", "Chickpea Salad with Tahini", "Whole Wheat Wrap with Beans"], 
    calories: 500, protein: 22, carbs: 60, fats: 14 
  },
  dinner: { 
    items: ["Lentil Soup with Veggies", "Grilled Tofu & Asparagus", "Zucchini Noodles with Pesto", "Tempeh Stir-fry"], 
    calories: 400, protein: 25, carbs: 35, fats: 12 
  },
  snacks: { 
    items: ["Roasted Makhana", "Handful of Nuts", "Fruit Bowl", "Hummus with Carrot Sticks"], 
    calories: 180, protein: 6, carbs: 25, fats: 7 
  },
  total: { calories: 1400, protein: 65, carbs: 160, fats: 41 }
};

router.get("/", authMiddleware, async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const userId = req.user.id;

  try {
    const [users] = await db.promise().query(
      "SELECT age, gender, weight, height, activity_level, diet_type FROM users WHERE id = ?",
      [userId]
    );

    const user = users[0] || { diet_type: 'vegetarian' };
    const dietType = user.diet_type || 'vegetarian';
    
    let fallback = VEG_PLAN;
    if (dietType === 'non-vegetarian') fallback = NON_VEG_PLAN;
    else if (dietType === 'vegan') fallback = VEGAN_PLAN;

    if (users.length === 0) {
      return res.json({ success: true, data: fallback });
    }

    const w = parseFloat(user.weight || 70);
    const h = parseFloat(user.height || 170);
    const a = parseInt(user.age || 30);
    
    // AI Content with Timeout
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a 1-day ${dietType.toUpperCase()} Indian meal plan JSON for ${w}kg, ${h}cm, ${a}yr ${user.gender}. 
    STRICT RULE: If ${dietType} is "vegetarian", NO meat, NO fish, NO eggs.
    If ${dietType} is "vegan", NO meat, NO fish, NO eggs, NO dairy (milk, paneer, curd, ghee).
    If ${dietType} is "non-vegetarian", prioritize high-protein Indian meat/egg/fish options.
    Provide EXACTLY 4 diverse suggestions for each meal (breakfast, lunch, snacks, dinner). 
    Return ONLY JSON with this structure: { "breakfast": { "items": [], "calories": 0, "protein": 0, "carbs": 0, "fats": 0 }, ... , "total": { "calories": 0, ... } }`;

    // 5s Timeout for AI
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 5000)
    );

    try {
      const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise
      ]);

      let text = result.response.text();
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const plan = JSON.parse(text);
      console.log("Diet API response: Success");
      return res.json({ success: true, data: plan });
    } catch (aiErr) {
      console.warn("Diet API: AI failed or timed out, using fallback");
      return res.json({ success: true, data: fallback });
    }

  } catch (error) {
    console.error("Diet API Error:", error);
    res.json({ success: true, data: fallback });
  }
});

router.post("/generate", authMiddleware, async (req, res) => {
  res.redirect(307, "/api/diet");
});

module.exports = router;



