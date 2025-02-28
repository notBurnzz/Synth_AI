const dynamoDB = require("../config/dbConfig"); // ✅ Use shared AWS config
require("dotenv").config(); // Load environment variables

const TABLE_NAME = process.env.DYNAMODB_USER_TABLE;

// ✅ Ensure table name exists
if (!TABLE_NAME) {
  console.warn("⚠️ Warning: Missing DYNAMODB_USER_TABLE environment variable.");
}

/**
 * ✅ Save or update user details in DynamoDB
 * @param {Object} userData - User details from Auth0
 */
const saveUser = async (userData) => {
  const { userId, email, name, picture } = userData;

  if (!userId || !email) {
    throw new Error("User ID and email are required.");
  }

  const params = {
    TableName: TABLE_NAME,
    Item: {
      userId,
      email,
      name: name || "Anonymous",
      picture: picture || "",
      lastLogin: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return { success: true, message: "User saved successfully!" };
  } catch (error) {
    console.error("❌ Error saving user:", error);
    throw new Error("Failed to save user.");
  }
};

/**
 * ✅ Retrieve user details from DynamoDB
 * @param {string} userId - User ID
 */
const getUser = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item || null;
  } catch (error) {
    console.error("❌ Error retrieving user:", error);
    throw new Error("Failed to retrieve user.");
  }
};

/**
 * ✅ Update user profile details
 * @param {string} userId - User ID
 * @param {Object} updateData - Updated user data
 */
const updateUser = async (userId, updateData) => {
  if (!userId || !updateData || Object.keys(updateData).length === 0) {
    throw new Error("User ID and valid update data are required.");
  }

  // Prevent updating the userId
  if (updateData.userId) {
    throw new Error("User ID cannot be updated.");
  }

  const updateExpression = [];
  const expressionAttributeValues = {};

  Object.keys(updateData).forEach((key) => {
    updateExpression.push(`${key} = :${key}`);
    expressionAttributeValues[`:${key}`] = updateData[key];
  });

  const params = {
    TableName: TABLE_NAME,
    Key: { userId },
    UpdateExpression: `SET ${updateExpression.join(", ")}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDB.update(params).promise();
    return { success: true, updatedAttributes: result.Attributes };
  } catch (error) {
    console.error("❌ Error updating user:", error);
    throw new Error("Failed to update user.");
  }
};

module.exports = { saveUser, getUser, updateUser };
