const express = require("express");
const router = express.Router();
const authMiddleware = require("../authMiddleware");
const db = require("../db");

// Get all goals for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const [goals] = await db.promise().query(
      "SELECT * FROM user_goals WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );
    res.json({ success: true, goals });
  } catch (error) {
    console.error("Fetch goals error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create a new goal
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { goal_type, target_value, current_value, unit, deadline } = req.body;

    if (!goal_type || !target_value) {
      return res.status(400).json({ success: false, message: "Goal type and target value are required" });
    }

    await db.promise().query(
      "INSERT INTO user_goals (user_id, goal_type, target_value, current_value, unit, deadline) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, goal_type, target_value, current_value || 0, unit, deadline]
    );

    res.json({ success: true, message: "Goal created successfully" });
  } catch (error) {
    console.error("Create goal error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update goal progress
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const goal_id = req.params.id;
    const { current_value, status } = req.body;

    const updates = [];
    const values = [];

    if (current_value !== undefined) {
      updates.push("current_value = ?");
      values.push(current_value);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    values.push(goal_id, user_id);
    await db.promise().query(
      `UPDATE user_goals SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
      values
    );

    res.json({ success: true, message: "Goal updated successfully" });
  } catch (error) {
    console.error("Update goal error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete a goal
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const goal_id = req.params.id;

    await db.promise().query(
      "DELETE FROM user_goals WHERE id = ? AND user_id = ?",
      [goal_id, user_id]
    );

    res.json({ success: true, message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Delete goal error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
