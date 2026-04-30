const db = require("./db");

db.query("DESCRIBE users", (err, results) => {
  if (err) {
    console.error("Failed to describe users:", err.message);
    process.exit(1);
  }
  console.log("USERS_COLUMNS:", JSON.stringify(results, null, 2));
  process.exit(0);
});
