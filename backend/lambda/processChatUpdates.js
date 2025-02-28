const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const dynamoDB = require("../config/dbConfig"); // Import existing DynamoDB config

dotenv.config(); // Load environment variables

// ✅ Ensure table name is set
const TABLE_NAME = process.env.DYNAMODB_CHAT_TABLE;
if (!TABLE_NAME) {
  console.warn("⚠️ Warning: Missing DYNAMODB_CHAT_TABLE environment variable.");
}

// ✅ Process chat message updates
exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    // Parse incoming event body
    const { userId, messageId, model, role, content, timestamp } = JSON.parse(event.body);

    if (!userId || !messageId || !model || !role || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required chat fields" }),
      };
    }

    // Set current UNIX timestamp and TTL (7 days)
    const currentTimestamp = Math.floor(Date.now() / 1000); // UNIX timestamp
    const ttl = currentTimestamp + (7 * 24 * 60 * 60); // Auto-delete after 7 days

    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId,
        messageId,
        model,
        role,
        content,
        timestamp: timestamp || currentTimestamp, // Use given timestamp or current time
        ttl, // ✅ Add TTL for auto-deletion
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Chat update processed successfully!" }),
    };
  } catch (error) {
    console.error("❌ Error updating chat:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process chat update" }),
    };
  }
};
