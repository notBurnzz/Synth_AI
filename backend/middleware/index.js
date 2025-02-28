const checkAuth = require("./auth"); // ✅ Auth0 JWT Middleware

// 🔹 Add more middleware imports here if needed (e.g., logging, rate-limiting, etc.)

module.exports = {
  checkAuth, // ✅ Centralized export of all middleware
};
