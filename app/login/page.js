"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

/**
 * Login Component
 *
 * @component
 * @returns {JSX.Element} A login form with email and password fields, including a show/hide password toggle and loading indicator.
 */
export default function Login() {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/"; // Default to home if no redirect specified

  /**
   * Handles form submission and sends data to the backend.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading indicator

    // Validation
    if (!email || !password) {
      setError("Both fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/authorisation/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      // Redirect to the intended page after successful login
      router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/${redirectTo}`);
    } catch (err) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--primary)] text-center mb-6">
          Log In
        </h1>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--password-text)] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-[var(--filter1-text)] focus:ring-[var(--button-hover-bg)] focus:outline-none focus:ring-2"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--password-text)] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:ring-blue-300 focus:outline-none focus:ring-2"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full bg-[var(--button-bg)] text-[var(--filter-text)] py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="text-center text-sm text-[var(--filter-text)]mt-4">
          Or log in with{" "}
          <button className="text-[var(--viewRecipe-bg)] bg-[var(--button-text)]  hover:underline focus:outline-none">
            Google
          </button>
        </p>
        <p className="text-center text-sm text-[var(--filter-text)] mt-4">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-[var(--highlight)]hover:underline focus:outline-none"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
