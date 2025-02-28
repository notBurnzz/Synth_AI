const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // ✅ Security middleware
const morgan = require("morgan"); // ✅ Request logging
const rateLimit = require("express-rate-limit"); // ✅ Rate limiter
const dotenv = require("dotenv");
const { checkAuth } = require("./middleware"); // ✅ Import middleware from index.js

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const userRoutes = require("./routes/user"); // ✅ Added user routes

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Configure CORS (Secure origin handling)
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Security middleware
app.use(helmet()); // Adds security headers

// ✅ Logging middleware (Only logs in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ Rate limiter (Prevents excessive requests)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes); // ✅ Added user routes

// ✅ Handle 404 Errors (For unknown routes)
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
