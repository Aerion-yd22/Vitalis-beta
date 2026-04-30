const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "health_app"
});

const queries = [
  `CREATE TABLE IF NOT EXISTS user_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_type VARCHAR(50) NOT NULL,
    target_value DECIMAL(10, 2) NOT NULL,
    current_value DECIMAL(10, 2) DEFAULT 0,
    unit VARCHAR(20),
    status ENUM('active', 'completed', 'failed') DEFAULT 'active',
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
        console.log("Goals table initialization complete");
      }
    });
  });
});
