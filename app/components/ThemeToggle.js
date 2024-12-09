"use client";
import { useEffect, useState } from "react";

/**
 * A component to toggle between dark and light themes.
 *
 * @function ThemeToggle
 * @returns {JSX.Element} A button to toggle between dark and light modes.
 */
const ThemeToggle = () => {
  /**
   * State to track whether the dark mode is active.
   * @type {[boolean, Function]} isDarkMode - Current dark mode state and the state updater function.
   */
  const [isDarkMode, setIsDarkMode] = useState(false);

  /**
   * Effect to initialize the theme based on user preference or system settings.
   * Runs only once when the component mounts.
   */
  useEffect(() => {
    // Ensure that localStorage is only accessed on the client side.
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = savedTheme
        ? savedTheme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  /**
   * Effect to update the theme in localStorage and apply the appropriate class to the document.
   * Runs whenever the `isDarkMode` state changes.
   */
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  /**
   * Toggles the theme between dark and light modes.
   */
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-200 rounded dark:bg-gray-800"
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} // Accessible label
    >
      {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
};

export default ThemeToggle;

