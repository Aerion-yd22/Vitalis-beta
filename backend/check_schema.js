const db = require("./db");

async function checkSchema() {
  try {
    const [usersCols] = await db.promise().query("SHOW COLUMNS FROM users");
    console.log("USERS COLUMNS:", JSON.stringify(usersCols, null, 2));

    const [logsCols] = await db.promise().query("SHOW COLUMNS FROM user_health_logs");
    console.log("LOGS COLUMNS:", JSON.stringify(logsCols, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error("Error checking schema:", err.message);
    process.exit(1);
  }
}

checkSchema();
