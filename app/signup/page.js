"use client";

/**
 * @file SignUp.jsx
 * @description A Sign Up form component that allows users to register with email and password.
 * Includes validation, error handling, and a loading indicator during processing.
 * Uses the `/api/authorisation/signup` API endpoint to register users.
 */

import React, { useState } from "react";

/**
 * SignUp Component
 *
 * @component
 * @returns {JSX.Element} A sign-up form with email, password, and confirm password fields.
 */
export default function SignUp() {
  const [email, setEmail] = useState(""); // State to store the email input
  const [password, setPassword] = useState(""); // State to store the password input
  const [confirmPassword, setConfirmPassword] = useState(""); // State to store the confirm password input
  const [error, setError] = useState(""); // State to store error messages
  const [success, setSuccess] = useState(""); // State to store success messages
  const [loading, setLoading] = useState(false); // State to manage the loading indicator
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  /**
   * Handles form submission and sends data to the backend.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // Show loading indicator

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false); // Stop loading
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false); // Stop loading
      return;
    }

    try {
      const response = await fetch("/api/authorisation/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      setLoading(false); // Stop loading
      if (response.status === 201) {
        setSuccess("User registered successfully!");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setLoading(false); // Stop loading
      setError(
        "Failed to connect to the server. Please check your network and try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-[var(--primary)] text-2xl font-semibold text-center mb-6">
          Sign Up
        </h1>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--filter-text)] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-md text-[var(--filter1-text)] focus:ring-2 focus:ring-[var(--button-hover-bg)] focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-[var(--filter-text)] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-[var(--filter1-text)] focus:ring-2 focus:ring-[var(--button-hover-bg)] focus:outline-none"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-[var(--filter-text)] hover-[var(--filter-text)] focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-[var(--filter-text)] mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 rounded-md text-[var(--filter-text)] focus:ring-2 focus:ring-[var(--button-hover-bg)] focus:outline-none"
                placeholder="Re-enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-[var(--filter-text)] hover:text-[var(--button-hover-bg)] focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full bg-[var(--viewRecipe-bg)] text-[var(--button-text)] py-2 px-4 rounded-md hover:bg-[var(--button-hover-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--button-hover-bg)] transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Signing you up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-[var(--filter-text)] mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[var(--highlight)] hover:underline focus:outline-none"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
