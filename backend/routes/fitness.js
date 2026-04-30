const express = require("express");
const router = express.Router();
const authMiddleware = require("../authMiddleware");
const db = require("../db");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get daily challenge and exercises
router.get("/daily", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // 1. Get user profile for personalization
    const [users] = await db.promise().query("SELECT age, gender, weight, height, activity_level, diseases FROM users WHERE id = ?", [user_id]);
    const user = users[0] || {};

    // 2. Get latest challenge for today
    const today = new Date().toISOString().split('T')[0];
    const [challenges] = await db.promise().query(
      "SELECT * FROM user_challenges WHERE user_id = ? AND DATE(created_at) = ?",
      [user_id, today]
    );

    let challenge;
    if (challenges.length === 0) {
      // Create new challenge for today
      const challengePool = [
        "Walk 5000 steps today",
        "Drink 2L water",
        "Do 15 min stretching",
        "Avoid sugar for today",
        "Meditate for 10 minutes",
        "Eat 2 portions of fruit"
      ];
      const randomChallenge = challengePool[Math.floor(Math.random() * challengePool.length)];
      
      // Get latest streak
      const [lastChallenge] = await db.promise().query(
        "SELECT streak, last_completed_at FROM user_challenges WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [user_id]
      );
      
      let streak = 0;
      if (lastChallenge.length > 0) {
        const lastDate = new Date(lastChallenge[0].last_completed_at);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate.toDateString() === yesterday.toDateString()) {
          streak = lastChallenge[0].streak;
        }
      }

      await db.promise().query(
        "INSERT INTO user_challenges (user_id, challenge_text, streak) VALUES (?, ?, ?)",
        [user_id, randomChallenge, streak]
      );
      
      const [newChallenge] = await db.promise().query("SELECT * FROM user_challenges WHERE id = LAST_INSERT_ID()");
      challenge = newChallenge[0];
    } else {
      challenge = challenges[0];
    }

    // 3. Generate exercises with AI
    let exercises = [];
    const level = user.activity_level?.toLowerCase() || 'sedentary';
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Generate 3 personalized safe exercises for a ${user.age} year old ${user.gender || 'user'} who is ${level} active, weighs ${user.weight}kg and is ${user.height}cm tall. 
      STRICT RULE: Exercises must be safe for their age. 
      Return ONLY a JSON array: [{"type": "walk/strength/stretch/run", "title": "Name", "duration": "10m", "icon": "FiActivity/FiZap/FiWind/FiTrendingUp"}]`;

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000));
      const aiResult = await Promise.race([model.generateContent(prompt), timeoutPromise]);
      
      let text = aiResult.response.text();
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      exercises = JSON.parse(text);
      console.log("Fitness AI: Success");
    } catch (aiErr) {
      console.warn("Fitness AI: Failed or timed out, using fallback");
      if (level === 'sedentary') {
        exercises = [
          { type: 'walk', title: '12 min Light Walk', duration: '12m', icon: 'FiWind' },
          { type: 'stretch', title: 'Neck & Shoulder Stretch', duration: '8m', icon: 'FiZap' },
          { type: 'activity', title: 'Standing Desk (30m)', duration: '30m', icon: 'FiActivity' }
        ];
      } else if (level === 'moderate' || level === 'light') {
        exercises = [
          { type: 'walk', title: '30 min Brisk Walk', duration: '30m', icon: 'FiTrendingUp' },
          { type: 'strength', title: 'Bodyweight Squats (3 sets)', duration: '15m', icon: 'FiActivity' },
          { type: 'stretch', title: 'Full Body Stretch', duration: '10m', icon: 'FiZap' }
        ];
      } else {
        exercises = [
          { type: 'run', title: '25 min Jogging', duration: '25m', icon: 'FiZap' },
          { type: 'strength', title: 'Pushups & Planks', duration: '20m', icon: 'FiActivity' },
          { type: 'cardio', title: 'High Intensity Intervals', duration: '15m', icon: 'FiTrendingUp' }
        ];
      }
    }

    res.json({
      success: true,
      challenge,
      exercises
    });

  } catch (error) {
    console.error("Fitness daily error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Complete daily challenge
router.post("/complete", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    
    const [challenges] = await db.promise().query(
      "SELECT * FROM user_challenges WHERE user_id = ? AND DATE(created_at) = ?",
      [user_id, today]
    );

    if (challenges.length === 0) return res.status(404).json({ success: false, message: "No challenge found for today" });
    if (challenges[0].completed) return res.json({ success: true, message: "Already completed" });

    const newStreak = challenges[0].streak + 1;
    const points = 10 + (newStreak > 3 ? 5 : 0); // Bonus after 3 days

    await db.promise().query(
      "UPDATE user_challenges SET completed = TRUE, points = ?, streak = ?, last_completed_at = CURRENT_TIMESTAMP WHERE id = ?",
      [points, newStreak, challenges[0].id]
    );

    res.json({
      success: true,
      message: "Challenge completed!",
      points,
      streak: newStreak
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
