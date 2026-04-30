require("dotenv").config();

const express = require("express");
require("./db");
const authRoutes = require("./routes/auth");
const recommendationsRoute = require("./routes/recommendations");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const fitnessRoutes = require("./routes/fitness");
const reportRoutes = require("./routes/report");
const goalsRoutes = require("./routes/goals");
const insightsRoutes = require("./routes/insights");
const dietRoutes = require("./routes/diet");
const logsRoutes = require("./routes/logs");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
  credentials: true
}));

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/recommendations", recommendationsRoute);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/fitness", fitnessRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/logs", logsRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, () => {
  console.log(`🔥 Vitalis Backend running on port ${PORT}`);
  console.log(`✅ Database Status: Connected`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is in use. Please kill the process or use a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("GLOBAL_ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred. Please try again later.",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
