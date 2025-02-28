const express = require("express");
const { checkAuth } = require("../middleware"); // ✅ Auth0 Middleware
const { storeMessage, getChatHistory } = require("../services/chatService"); // ✅ Import Chat Services

const router = express.Router();

// ✅ Base Route (For Testing)
router.get("/", (req, res) => {
    res.json({ message: "Chat API is working!" });
});

// ✅ Protected Route: Store a Message
router.post("/storeMessage", checkAuth, async (req, res) => {
    try {
        const { chatId, userId, message, sender } = req.body;

        if (!chatId || !userId || !message || !sender) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        await storeMessage(chatId, userId, message, sender);
        res.status(200).json({ message: "Chat stored successfully!" });
    } catch (error) {
        console.error("❌ Error storing message:", error);
        res.status(500).json({ error: "Failed to store chat message" });
    }
});

// ✅ Protected Route: Retrieve Chat History (Last 7 Days)
router.get("/chatHistory/:chatId", checkAuth, async (req, res) => {
    try {
        const chatId = req.params.chatId;
        if (!chatId) {
            return res.status(400).json({ error: "Chat ID is required" });
        }

        const chatHistory = await getChatHistory(chatId);
        res.status(200).json(chatHistory);
    } catch (error) {
        console.error("❌ Error fetching chat history:", error);
        res.status(500).json({ error: "Failed to retrieve chat history" });
    }
});

module.exports = router; // ✅ Ensure ONLY the router is exported
