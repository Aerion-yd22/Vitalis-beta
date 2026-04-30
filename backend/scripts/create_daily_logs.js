const db = require("../db");

const queries = [
  `CREATE TABLE IF NOT EXISTS daily_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    log_date DATE NOT NULL,
    diet_adherence ENUM('yes', 'partial', 'no') NOT NULL,
    workout_done BOOLEAN DEFAULT FALSE,
    energy_level ENUM('high', 'medium', 'low') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_date (user_id, log_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`
];

(async () => {
  for (const q of queries) {
    try {
      await db.promise().query(q);
      console.log("SUCCESS: Created daily_logs table");
    } catch (err) {
      console.error("FAILED: daily_logs table creation", err.message);
    }
  }
  process.exit(0);
})();
