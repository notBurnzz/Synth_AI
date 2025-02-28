const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
require("dotenv").config(); // Load environment variables

// ✅ Ensure Auth0 environment variables are set
if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  console.warn("⚠️ Warning: Missing Auth0 configuration. Check your .env file.");
}

// ✅ Configure JWT authentication middleware
const checkAuth = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE, // ✅ Ensure audience is correctly set
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

module.exports = checkAuth;
