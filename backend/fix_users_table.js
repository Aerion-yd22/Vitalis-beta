const db = require("./db");

const queries = [
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS weight FLOAT AFTER gender;",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS height FLOAT AFTER weight;"
];

(async () => {
  for (const q of queries) {
    try {
      await db.promise().query(q);
      console.log(`Query Success: ${q}`);
    } catch (err) {
      console.error(`Query Failed: ${q}`, err.message);
    }
  }
  process.exit(0);
})();
