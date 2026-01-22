import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ThemeContext = createContext();
const API_URL = "http://localhost:5000/api";

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch theme preference from backend on mount
  useEffect(() => {
    const fetchThemePreference = async () => {
      try {
        const response = await axios.get(`${API_URL}/theme`, {
          withCredentials: true,
        });

        if (response.data.darkMode !== null) {
          setDarkMode(response.data.darkMode);
        }
      } catch (error) {
        console.error("Error fetching theme preference:", error);
        // Fallback to localStorage if backend is unavailable
      } finally {
        setIsInitialized(true);
      }
    };

    fetchThemePreference();
  }, []);

  // Save theme preference to both localStorage and backend
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    // Save to backend
    const saveTheme = async () => {
      try {
        await axios.post(
          `${API_URL}/theme`,
          { darkMode },
          {
            withCredentials: true,
          },
        );
      } catch (error) {
        console.error("Error saving theme preference:", error);
        // Silently fail - localStorage is already updated as fallback
      }
    };

    saveTheme();

    // Update DOM
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, isInitialized]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
