const mysql = require("mysql2");

console.log("🔥 USING FORCED CONFIG");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "health_app"
});

connection.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
    return;
  }
  console.log("✅ DB connected");
});

module.exports = connection;
