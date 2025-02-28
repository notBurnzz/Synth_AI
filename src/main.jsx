import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ Import Auth0Provider directly
import { Auth0Provider } from "@auth0/auth0-react";

import { ChatProvider } from "./contexts/ChatContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ModelProvider } from "./contexts/ModelContext";

// ✅ Import Global Styles
import "./styles/global.css";
import "./styles/variables.css";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    }}
  >
    <ThemeProvider>
      <ModelProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </ModelProvider>
    </ThemeProvider>
  </Auth0Provider>
);
