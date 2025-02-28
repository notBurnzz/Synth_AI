import { createContext, useContext, useEffect, useState } from "react";

// ✅ Create Theme Context
const ThemeContext = createContext();

/**
 * ✅ ThemeProvider Component
 * Manages dark mode/light mode preferences across the app.
 */
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark"; // Load from localStorage
  });

  // ✅ Toggle Dark Mode
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      const theme = newMode ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme); // ✅ Set data-theme on <html>
      localStorage.setItem("theme", theme); // Save preference
      return newMode;
    });
  };

  // ✅ Apply saved theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setIsDarkMode(savedTheme === "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Custom hook to use ThemeContext
export function useTheme() {
  return useContext(ThemeContext);
}
