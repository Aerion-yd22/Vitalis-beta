const express = require("express");
const router = express.Router();
const authMiddleware = require("../authMiddleware");
const db = require("../db");

// Get profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [user_id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });
    
    const { password_hash, ...profile } = rows[0];
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update profile
router.post("/profile", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const fields = [
      "age", "gender", "weight", "height", "activity_level", "sleep_hours", "sleep_quality",
      "diet_type", "water_intake", "stress_level", "smoking", "alcohol",
      "heart_rate", "blood_pressure", "family_history", "diseases", "location",
      "daily_updates", "weekly_summary"
    ];

    const updates = [];
    const values = [];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(field === 'location' ? JSON.stringify(req.body[field]) : req.body[field]);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    values.push(user_id);
    await db.promise().query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get alerts
router.get("/alerts", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rows] = await db.promise().query(
      "SELECT * FROM user_alerts WHERE user_id = ? ORDER BY created_at DESC LIMIT 10",
      [user_id]
    );
    res.json({ success: true, alerts: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Mock environmental data
router.get("/environment", authMiddleware, async (req, res) => {
  try {
    const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad"];
    const city = cities[Math.floor(Math.random() * cities.length)];

    const mockEnv = {
      city: city,
      temp: 32 + Math.floor(Math.random() * 10),
      uv: Math.floor(Math.random() * 12),
      humidity: 40 + Math.floor(Math.random() * 30),
      condition: "Sunny"
    };

    // Generate alerts based on environment
    const user_id = req.user.id;
    if (mockEnv.uv > 7) {
      await db.promise().query(
        "INSERT INTO user_alerts (user_id, alert_type, message) VALUES (?, ?, ?)",
        [user_id, "UV_ALERT", "🌞 High UV exposure. Wear sunscreen!"]
      );
    }
    if (mockEnv.temp > 35) {
      await db.promise().query(
        "INSERT INTO user_alerts (user_id, alert_type, message) VALUES (?, ?, ?)",
        [user_id, "HEAT_ALERT", "🔥 Heat alert! Stay hydrated."]
      );
    }

    res.json({ success: true, ...mockEnv });
  } catch (err) {
    console.error("Environment route error:", err);
    // Even if alert insertion fails, return the mockEnv so dashboard doesn't hang
    res.json({ success: true, city: "Local", temp: 30, uv: 5, humidity: 50, condition: "Clear" });
  }
});

module.exports = router;
