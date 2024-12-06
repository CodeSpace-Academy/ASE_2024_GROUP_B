"use client";

import "./global.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Head from "next/head";
import { useEffect, useState } from "react";
import { metadata } from "../lib/metadata";

/**
 * Root layout component of the application.
 * Provides the main structure with the header, main content area, and footer.
 *
 * @function RootLayout
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child elements to be rendered in the main section.
 * @returns {JSX.Element} The HTML layout for the page.
 */
export default function RootLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null); // State to store logged-in user details

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/authorisation/session", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Store user session details if valid
        } else {
          console.warn("No active session");
          setUser(null); // Clear user state if session is invalid or missing
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setUser(null); // Ensure state consistency on error
      }
    };

    fetchSession();

    // Load and apply theme preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDarkMode =
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(prefersDarkMode);
    document.documentElement.classList.toggle("dark", prefersDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <meta name="author" content={metadata.author} />
        <link rel="manifest" href={metadata.manifest} />
        <meta name="theme-color" content={isDarkMode ? "#0a0a0a" : "#ffffff"} />
      </Head>
      <body className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
        <Header user={user} /> {/* Pass user data to the header */}
        <main className="flex-grow pt-16">
          {/* Show user info if logged in */}
          {user ? (
            <p className="text-center text-sm text-green-500">Welcome, {user.email}</p>
          ) : (
            <p className="text-center text-sm text-red-500">You are not logged in</p>
          )}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
