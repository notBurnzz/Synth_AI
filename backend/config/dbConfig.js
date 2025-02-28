const AWS = require("aws-sdk");
const dotenv = require("dotenv");

// ✅ Load environment variables
dotenv.config();

// ✅ Configure AWS SDK for DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || "ap-south-1", // Default to Mumbai if not set
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

console.log("✅ DynamoDB Connected to Region:", process.env.AWS_REGION || "ap-south-1");

// ✅ Export the DynamoDB instance
module.exports = dynamoDB;
