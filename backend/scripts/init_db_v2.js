const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "health_app"
});

const queries = [
  `CREATE TABLE IF NOT EXISTS user_challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_text VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    points INT DEFAULT 0,
    streak INT DEFAULT 0,
    last_completed_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`
];

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to DB:", err.message);
    process.exit(1);
  }
  console.log("Connected to DB");

  let completed = 0;
  queries.forEach(q => {
    connection.query(q, (err) => {
      if (err) console.error("Query failed:", err.message);
      else console.log("Query success");
      
      completed++;
      if (completed === queries.length) {
        connection.end();
        console.log("DB Initialization complete");
      }
    });
  });
});
