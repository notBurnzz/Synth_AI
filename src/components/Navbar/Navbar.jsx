import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext"; // ✅ Import Theme Context
import { useAuth0 } from "@auth0/auth0-react"; // ✅ Import Auth0 for authentication
import styles from "./Navbar.module.css";

export function Navbar({ selectedModel, setSelectedModel }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isDarkMode, toggleTheme } = useTheme(); // ✅ Use theme context
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0(); // ✅ Auth0 authentication

  // 🔹 Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.Navbar}>
      <div className={styles.NavbarContent}>
        {/* 🔹 Logo + Title */}
        <div className={styles.LeftSection}>
          <img className={styles.Logo} src="/chat-bot.png" alt="Chatterly AI Logo" />
          <h2 className={styles.Title}>Chatterly AI</h2>
        </div>

        {/* 🔹 Right Section: Model Selector + Features + Auth */}
        <div className={styles.RightSection}>
          {/* 🔹 AI Model Selector */}
          <div className={styles.ModelSelector}>
            <label htmlFor="model-select" className={styles.ModelLabel}>Model:</label>
            <select
              id="model-select"
              className={styles.ModelSelect}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="googleai">Google AI</option>
              <option value="openai">OpenAI</option>
              <option value="deepseekai">DeepSeek AI</option>
              <option value="qwenai">Qwen AI</option>
            </select>
          </div>

          {/* 🔹 Features Dropdown */}
          <div className={styles.FeaturesDropdown} ref={dropdownRef}>
            <button
              className={styles.FeaturesButton}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-label="Toggle Features Menu"
            >
              Features
            </button>

            {isDropdownOpen && (
              <ul className={styles.FeaturesList}>
                <li>
                  {/* ✅ Toggle Dark Mode directly */}
                  <button className={styles.ThemeToggle} onClick={toggleTheme}>
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </li>
                <li onClick={() => alert("Feature 1 activated!")}>Feature 1</li>
                <li onClick={() => alert("Feature 2 activated!")}>Feature 2</li>
              </ul>
            )}
          </div>

          {/* 🔹 Authentication Section */}
          {isAuthenticated ? (
            <div className={styles.UserSection}>
              <img className={styles.UserAvatar} src={user.picture} alt="User Avatar" />
              <span className={styles.UserEmail}>{user.email}</span>
              <button className={styles.AuthButton} onClick={() => logout({ returnTo: window.location.origin })}>
                Logout
              </button>
            </div>
          ) : (
            <button className={styles.AuthButton} onClick={() => loginWithRedirect()}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
