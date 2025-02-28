import { apiRequest } from "../api/apiClient";

/**
 * 🔹 Save a chat message to the backend.
 * @param {string} token - The Auth0 access token.
 * @param {Object} message - The message object ({ userId, model, role, content, timestamp }).
 * @returns {Promise<Object>} - The saved chat message from the backend.
 */
export async function saveChatMessage(token, message) {
  if (!token || !message) throw new Error("Missing required parameters for saving chat.");

  try {
    return await apiRequest("/api/chat/save", "POST", message, { Authorization: `Bearer ${token}` });
  } catch (error) {
    console.error("Error saving chat message:", error);
    throw new Error("Failed to save chat message.");
  }
}

/**
 * 🔹 Retrieve chat history for a specific user and model.
 * @param {string} token - The Auth0 access token.
 * @param {string} userId - The user ID.
 * @param {string} model - The AI model used.
 * @returns {Promise<Array>} - An array of chat messages.
 */
export async function getChatHistory(token, userId, model) {
  if (!token || !userId || !model) throw new Error("User ID, token, and model are required.");

  try {
    return await apiRequest(`/api/chat/history?userId=${userId}&model=${model}`, "GET", null, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw new Error("Failed to retrieve chat history.");
  }
}

/**
 * 🔹 Delete all chat messages for a user and model.
 * @param {string} token - The Auth0 access token.
 * @param {string} userId - The user ID.
 * @param {string} model - The AI model used.
 * @returns {Promise<void>}
 */
export async function deleteChatHistory(token, userId, model) {
  if (!token || !userId || !model) throw new Error("User ID, token, and model are required.");

  try {
    return await apiRequest("/api/chat/delete", "DELETE", { userId, model }, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    console.error("Error deleting chat history:", error);
    throw new Error("Failed to delete chat history.");
  }
}
