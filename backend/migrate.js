const db = require("./db");

async function migrate() {
  try {
    console.log("Starting migration...");

    const columnsToAdd = [
      "age INT",
      "gender VARCHAR(20)",
      "activity_level VARCHAR(20)",
      "sleep_hours INT",
      "sleep_quality VARCHAR(20)",
      "diet_type VARCHAR(20)",
      "water_intake INT",
      "stress_level VARCHAR(20)",
      "smoking VARCHAR(10)",
      "alcohol VARCHAR(20)",
      "heart_rate INT",
      "blood_pressure VARCHAR(20)",
      "family_history TEXT",
      "diseases TEXT",
      "location JSON",
      "daily_updates BOOLEAN DEFAULT TRUE",
      "weekly_summary BOOLEAN DEFAULT TRUE"
    ];

    for (const col of columnsToAdd) {
      try {
        await db.promise().query(`ALTER TABLE users ADD COLUMN ${col}`);
        console.log(`Added column: ${col}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column already exists: ${col.split(' ')[0]}`);
        } else {
          throw err;
        }
      }
    }

    // Recreate user_health_logs
    await db.promise().query("SET FOREIGN_KEY_CHECKS = 0");
    await db.promise().query("DROP TABLE IF EXISTS user_health_logs");
    const createLogs = `
      CREATE TABLE user_health_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        weight DECIMAL(5,2),
        height DECIMAL(5,2),
        bmi DECIMAL(5,2),
        vitals_snapshot JSON,
        recommendations TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    await db.promise().query(createLogs);
    console.log("user_health_logs table recreated.");

    // Create user_alerts
    await db.promise().query("DROP TABLE IF EXISTS user_alerts");
    const createAlerts = `
      CREATE TABLE user_alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        alert_type VARCHAR(50),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    await db.promise().query(createAlerts);
    console.log("user_alerts table created.");
    await db.promise().query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
