require("dotenv").config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET) {
    console.warn("⚠️ Warning: Missing Auth0 environment variables. Check your .env file.");
}

module.exports = {
    auth0: {
        domain: process.env.AUTH0_DOMAIN || "", // Default to empty string if missing
        clientId: process.env.AUTH0_CLIENT_ID || "",
        clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
    }
};
