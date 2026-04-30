const express = require("express");
const router = express.Router();
const authMiddleware = require("../authMiddleware");
const db = require("../db");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", authMiddleware, upload.single("report"), async (req, res) => {
  try {
    const { age, weight, height, gender, activity, diet, conditions, blood_pressure } = req.body;
    const user_id = req.user.id;

    // VALIDATION: Check required fields
    if (!age || !weight || !height) {
      return res.status(400).json({
        success: false,
        message: "Age, weight, and height are mandatory for accurate health analysis."
      });
    }

    // SANITIZATION: Ensure numbers are valid
    if (isNaN(age) || isNaN(weight) || isNaN(height)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid numerical values for age, weight, and height."
      });
    }

    const [users] = await db.promise().query("SELECT * FROM users WHERE id = ?", [user_id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: "User not found" });
    
    const user = users[0];
    const data = { ...user, ...req.body };

    let pdfText = "";
    if (req.file) {
      try {
        const pdfData = await pdfParse(req.file.buffer);
        pdfText = pdfData.text;
        console.log(`Successfully parsed PDF report. Character count: ${pdfText.length}`);
      } catch (pdfErr) {
        console.error("PDF Parsing Error:", pdfErr);
        pdfText = "Error parsing PDF file.";
      }
    }

    let structuredVitals = {};
    if (req.body.structured_vitals) {
      try {
        structuredVitals = JSON.parse(req.body.structured_vitals);
      } catch (e) {}
    }

    const envData = {
      city: req.body.city || "Unknown",
      temp: req.body.temp || "N/A",
      uv: req.body.uv || "N/A",
      condition: req.body.condition || "N/A"
    };

    // SCIENTIFIC CALCULATIONS FOR AI CONTEXT
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const g = gender?.toLowerCase() || 'male';
    
    let bmr = 0;
    if (g === 'male') bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
    else bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;

    const activityMap = { 'sedentary': 1.2, 'moderate': 1.55, 'active': 1.725, 'light': 1.375 };
    const multiplier = activityMap[activity?.toLowerCase()] || 1.2;
    const tdee = bmr * multiplier;

    const prompt = `
Act as Vitalis AI, a professional medical consultant and health coach. 
Your goal is to provide a high-precision, data-driven analysis of the user's health based on their vitals, environment, and an uploaded medical report.

USER DATA:
- Age: ${age}
- Weight: ${weight}kg
- Height: ${height}cm
- BMI: ${(weight / ((height/100)*(height/100))).toFixed(2)}
- BMR (Basal Metabolic Rate): ${bmr.toFixed(0)} kcal/day
- TDEE (Total Daily Energy Expenditure): ${tdee.toFixed(0)} kcal/day
- Activity Level: ${activity || "Sedentary"}
- Blood Pressure: ${blood_pressure || "Not provided"}
- Diet Preference: ${diet || "General"}
- Existing Conditions: ${conditions || "None reported"}

DETAILED HEALTH METRICS:
${JSON.stringify(structuredVitals, null, 2)}

ENVIRONMENTAL CONTEXT:
- Location: ${envData.city}
- Temp: ${envData.temp}°C
- Condition: ${envData.condition}
- UV Index: ${envData.uv}

UPLOADED MEDICAL REPORT CONTENT (IMPORTANT):
${pdfText || "No report uploaded."}

ANALYSIS INSTRUCTIONS:
1. If a medical report is provided, prioritize interpreting its key findings (e.g., blood markers, glucose levels, cholesterol) in the context of the user's vitals.
2. Provide a "Smart Insight" section (3 clear paragraphs):
   - Paragraph 1: Executive Summary - State the current health status and highlight any immediate flags from the vitals or report.
   - Paragraph 2: Underlying Factors - Explain *why* certain values might be out of range (e.g., link high BMI to metabolic health or environment to immunity).
   - Paragraph 3: Actionable Forecast - What happens if they continue this trend, and what is the primary goal for the next 30 days. Use the TDEE of ${tdee.toFixed(0)} kcal as a baseline for nutrition advice.
3. Provide a tailored "Lifestyle Blueprint" with specific sections for Diet, Exercise, and Safety.
4. If the report contains abnormal values, mention them explicitly but maintain a calm, professional tone.

STRUCTURED DATA OUTPUT:
At the very end of your response, add exactly the text "STRUCTURED_INSIGHTS" followed by a raw JSON block (NO markdown backticks) containing:
{
  "hydration": "concise advice on water based on vitals and weather",
  "sleep": "advice on sleep based on reported sleep quality",
  "recovery": "advice on physical recovery",
  "metabolism": "advice on diet/metabolism based on activity level",
  "immunity": "advice on immunity based on environment",
  "weather_suggestion": "one short sentence about current weather impact"
}

Maintain a professional, empathetic, and clinical-yet-accessible persona.
`;


    // Try a few models in case of quota exhaustion
    const MODEL_CHAIN = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];
    let text = "";
    
    for (const modelName of MODEL_CHAIN) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1200, temperature: 0.4 }
        });
        text = result.response.candidates[0].content.parts[0].text;
        if (text) break;
      } catch (err) {
        console.error(`Model ${modelName} failed:`, err.message?.substring(0, 100));
      }
    }
    
    if (!text) {
      console.warn("⚠️ All AI models failed. Using fallback health recommendations.");
      const bmi = (weight / ((height/100)*(height/100))).toFixed(1);
      const bmiCategory = bmi < 18.5 ? "Underweight" : (bmi < 25 ? "Normal" : (bmi < 30 ? "Overweight" : "Obese"));
      
      text = `Based on your vitals (BMI: ${bmi}, Category: ${bmiCategory}), here is a general health plan:
      
      **Analysis:** Your BMI is in the ${bmiCategory} range. ${bmiCategory === 'Normal' ? 'Maintain your current lifestyle with balanced nutrition.' : 'Consider consulting a nutritionist for a tailored weight management plan.'}
      
      **Diet:** Focus on whole foods, lean proteins, and plenty of vegetables. Maintain consistent meal timings.
      
      **Exercise:** Aim for at least 30 minutes of moderate activity 5 days a week. Focus on consistency over intensity.
      
      **Safety:** Stay hydrated and monitor your symptoms. If you experience persistent fatigue or headaches, consult a professional.
      
      STRUCTURED_INSIGHTS
      {
        "hydration": "Drink 3-4L of water daily. Increase if active.",
        "sleep": "Aim for 7-9 hours of restful sleep.",
        "recovery": "Include active recovery days and stretching.",
        "metabolism": "Eat small, frequent meals to stabilize energy.",
        "immunity": "Include Vitamin C rich foods and maintain hygiene.",
        "weather_suggestion": "The current weather requires staying well-hydrated."
      }`;
    }

    // Save log
    const vitals_snapshot = JSON.stringify(data);
    const bmi = (weight / ((height/100)*(height/100))).toFixed(2);
    
    await db.promise().query(
      "INSERT INTO user_health_logs (user_id, weight, height, bmi, vitals_snapshot, recommendations) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, weight || null, height || null, bmi || null, vitals_snapshot, text]
    );

    // PERSIST DATA: Update users table with latest profile info
    await db.promise().query(
      "UPDATE users SET age = ?, gender = ?, weight = ?, height = ?, activity_level = ?, diet_type = ?, diseases = ?, blood_pressure = ? WHERE id = ?",
      [age || null, gender || null, weight || null, height || null, activity || null, diet || null, conditions || null, blood_pressure || null, user_id]
    );

    return res.json({
      success: true,
      recommendations: text,
      last_updated: new Date()
    });

    } catch (error) {
      console.error("Critical Server Error:", error);
      res.status(500).json({ success: false, message: "A server error occurred. Please try again." });
    }
  });

router.get("/latest", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rows] = await db.promise().query(
      "SELECT * FROM user_health_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 2",
      [user_id]
    );

    if (rows.length === 0) return res.json({ success: true, data: null });

    const latest = rows[0];
    const previous = rows.length > 1 ? rows[1] : null;

    res.json({
      success: true,
      data: {
        ...latest,
        trend: {
          weight_change: previous ? (latest.weight - previous.weight).toFixed(2) : 0,
          bmi_change: previous ? (latest.bmi - previous.bmi).toFixed(2) : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;