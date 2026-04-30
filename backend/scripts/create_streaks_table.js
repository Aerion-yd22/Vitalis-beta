const db = require("../db");

const queries = [
  `CREATE TABLE IF NOT EXISTS streaks (
    user_id INT PRIMARY KEY,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_logged_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`
];

(async () => {
  for (const q of queries) {
    try {
      await db.promise().query(q);
      console.log("SUCCESS: Created streaks table");
    } catch (err) {
      console.error("FAILED: streaks table creation", err.message);
    }
  }
  process.exit(0);
})();
