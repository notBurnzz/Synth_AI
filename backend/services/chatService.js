const dynamoDB = require("../config/dbConfig"); // ✅ Use shared AWS config
require("dotenv").config(); // Load environment variables

const TABLE_NAME = process.env.DYNAMODB_CHAT_TABLE;

// ✅ Ensure table name exists
if (!TABLE_NAME) {
  console.warn("⚠️ Warning: Missing DYNAMODB_CHAT_TABLE environment variable.");
}

/**
 * ✅ Save a new chat message to DynamoDB with TTL
 * @param {Object} messageData - Chat message details
 */
const saveChatMessage = async (messageData) => {
  const { chatId, userId, messageId, model, role, content, timestamp } = messageData;

  if (!chatId || !userId || !messageId || !model || !role || !content) {
    throw new Error("Missing required chat fields.");
  }

  // ✅ Set current UNIX timestamp and TTL (7 days)
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const ttl = currentTimestamp + (7 * 24 * 60 * 60); // Auto-delete after 7 days

  const params = {
    TableName: TABLE_NAME,
    Item: {
      chatId, // ✅ Group messages by chat session
      timestamp: timestamp || currentTimestamp, // ✅ Sort key
      userId,
      messageId,
      model,
      role,
      content,
      ttl, // ✅ Add TTL for auto-deletion
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return { success: true, message: "Chat message saved successfully!" };
  } catch (error) {
    console.error("❌ Error saving chat message:", error);
    throw new Error("Failed to save chat message.");
  }
};

/**
 * ✅ Retrieve chat history for the last 7 days
 * @param {string} chatId - Chat session ID
 */
const getChatHistory = async (chatId) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  const sevenDaysAgo = Math.floor((Date.now() - (7 * 24 * 60 * 60 * 1000)) / 1000);

  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "chatId = :chatId AND timestamp >= :sevenDaysAgo",
    ExpressionAttributeValues: {
      ":chatId": chatId,
      ":sevenDaysAgo": sevenDaysAgo,
    },
    ScanIndexForward: true, // Set to false if you want newest messages first
  };

  try {
    const result = await dynamoDB.query(params).promise();
    return result.Items || [];
  } catch (error) {
    console.error("❌ Error retrieving chat history:", error);
    throw new Error("Failed to retrieve chat history.");
  }
};

/**
 * ✅ Delete a chat message by chatId + timestamp
 * @param {string} chatId - Chat session ID
 * @param {number} timestamp - Timestamp of the message
 */
const deleteChatMessage = async (chatId, timestamp) => {
  if (!chatId || !timestamp) {
    throw new Error("Chat ID and Timestamp are required.");
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      chatId,
      timestamp, // ✅ Correct Sort Key
    },
  };

  try {
    await dynamoDB.delete(params).promise();
    return { success: true, message: "Chat message deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting chat message:", error);
    throw new Error("Failed to delete chat message.");
  }
};

module.exports = { saveChatMessage, getChatHistory, deleteChatMessage };
