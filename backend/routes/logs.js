const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../authMiddleware");

// Save or Update daily log + Update Streak
router.post("/daily", authMiddleware, async (req, res) => {
  const { diet_adherence, workout_done, energy_level } = req.body;
  const user_id = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Save Daily Log
    const logQuery = `
      INSERT INTO daily_logs (user_id, log_date, diet_adherence, workout_done, energy_level)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      diet_adherence = VALUES(diet_adherence),
      workout_done = VALUES(workout_done),
      energy_level = VALUES(energy_level)
    `;
    await db.promise().query(logQuery, [user_id, today, diet_adherence, workout_done, energy_level]);

    // 2. Update Streak
    const [streakRows] = await db.promise().query("SELECT * FROM streaks WHERE user_id = ?", [user_id]);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streakRows.length === 0) {
      await db.promise().query(
        "INSERT INTO streaks (user_id, current_streak, longest_streak, last_logged_date) VALUES (?, 1, 1, ?)",
        [user_id, today]
      );
    } else {
      const streak = streakRows[0];
      const lastDate = streak.last_logged_date ? new Date(streak.last_logged_date).toISOString().split('T')[0] : null;

      if (lastDate === today) {
        // Already logged today
      } else if (lastDate === yesterdayStr) {
        const newStreak = streak.current_streak + 1;
        const newLongest = Math.max(newStreak, streak.longest_streak);
        await db.promise().query(
          "UPDATE streaks SET current_streak = ?, longest_streak = ?, last_logged_date = ? WHERE user_id = ?",
          [newStreak, newLongest, today, user_id]
        );
      } else {
        await db.promise().query(
          "UPDATE streaks SET current_streak = 1, last_logged_date = ? WHERE user_id = ?",
          [today, user_id]
        );
      }
    }

    // 3. Dynamic Weight Simulation
    const [userRows] = await db.promise().query("SELECT weight, height FROM users WHERE id = ?", [user_id]);
    if (userRows[0]) {
      let weightChange = 0;
      if (diet_adherence === 'yes' && workout_done) weightChange = -0.1;
      else if (diet_adherence === 'partial' && workout_done) weightChange = -0.05;
      else if (diet_adherence === 'no' && !workout_done) weightChange = 0.05;

      if (weightChange !== 0) {
        const currentWeight = parseFloat(userRows[0].weight);
        const height = parseFloat(userRows[0].height);
        const newWeight = Math.max(40, currentWeight + weightChange).toFixed(2);
        const newBmi = (newWeight / ((height / 100) * (height / 100))).toFixed(2);

        // Update users table
        await db.promise().query("UPDATE users SET weight = ? WHERE id = ?", [newWeight, user_id]);

        // Log the change in history to update trends
        const [lastLogs] = await db.promise().query(
          "SELECT vitals_snapshot, recommendations FROM user_health_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
          [user_id]
        );
        
        const snapshot = lastLogs[0]?.vitals_snapshot ? JSON.stringify(lastLogs[0].vitals_snapshot) : null;
        const recs = lastLogs[0]?.recommendations || "Daily habit update";

        await db.promise().query(
          "INSERT INTO user_health_logs (user_id, weight, height, bmi, vitals_snapshot, recommendations) VALUES (?, ?, ?, ?, ?, ?)",
          [user_id, newWeight, height, newBmi, snapshot, recs]
        );
      }
    }

    res.json({ success: true, message: "Log saved. Your body is responding to your habits! 🚀" });
  } catch (err) {
    console.error("Daily Log Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get today's log or recent trends
router.get("/status", authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const [logRows] = await db.promise().query(
      "SELECT * FROM daily_logs WHERE user_id = ? AND log_date = ?",
      [user_id, today]
    );

    const [streakRows] = await db.promise().query(
      "SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?",
      [user_id]
    );

    res.json({ 
      success: true, 
      log: logRows[0] || null,
      streak: streakRows[0] || { current_streak: 0, longest_streak: 0 }
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// New explicit streak route
router.get("/streak", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?",
      [req.user.id]
    );
    res.json({ success: true, streak: rows[0] || { current_streak: 0, longest_streak: 0 } });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
