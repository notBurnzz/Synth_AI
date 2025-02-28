const express = require("express");
const checkAuth = require("../middleware/auth");

const router = express.Router();

// ✅ Protect this route with Auth0 authentication
router.get("/user", checkAuth, (req, res) => {
    try {
        res.json({ user: req.user });
    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
});

module.exports = router; // ✅ Ensure ONLY the router is exported
