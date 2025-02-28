/**
 * Generic API client for making authenticated requests.
 * @param {string} endpoint - The API endpoint (e.g., "/api/chat/save").
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
 * @param {Object} [body=null] - Request body for POST/PUT.
 * @param {Object} [headers={}] - Additional headers.
 * @param {string} [token=null] - Auth0 access token for authentication.
 * @returns {Promise<Object>} - Parsed response JSON or error.
 */
export async function apiRequest(endpoint, method = "GET", body = null, headers = {}, token = null) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API base URL is missing. Set VITE_API_BASE_URL in environment variables.");
  }

  const requestOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  };

  // 🔹 Inject Auth0 Token if available
  if (token) {
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API Error: ${response.status} - ${response.statusText}. ${errorData?.message || "No details available."}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in API request:", { endpoint, method, error: error.message });
    throw error;
  }
}

/**
 * 🔹 Fetch Chat History for a User
 * @param {string} token - Auth0 access token.
 * @param {string} userId - The user ID.
 * @param {string} model - The AI model used.
 * @returns {Promise<Array>} - An array of chat messages.
 */
export async function getChatHistory(token, userId, model) {
  return await apiRequest(`/api/chat/history?userId=${userId}&model=${model}`, "GET", null, {}, token);
}

/**
 * 🔹 Save a Chat Message
 * @param {string} token - Auth0 access token.
 * @param {Object} message - Chat message object { userId, model, role, content }.
 * @returns {Promise<Object>} - The saved chat message.
 */
export async function saveChatMessage(token, message) {
  return await apiRequest("/api/chat/save", "POST", message, {}, token);
}

/**
 * 🔹 Delete Chat History for a User
 * @param {string} token - Auth0 access token.
 * @param {string} userId - The user ID.
 * @param {string} model - The AI model used.
 * @returns {Promise<void>}
 */
export async function deleteChatHistory(token, userId, model) {
  return await apiRequest(`/api/chat/delete`, "DELETE", { userId, model }, {}, token);
}
