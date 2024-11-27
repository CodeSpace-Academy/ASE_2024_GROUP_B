"use client";

/**
 * @file SignUp.jsx
 * @description A Sign Up form component that allows users to register with email and password. 
 * Includes validation and error handling for mismatched passwords and required fields.
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

  /**
   * Handles form submission and sends data to the backend.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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

      if (response.status === 201) {
        const data = await response.json();
        setSuccess("User registered successfully!");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Sign Up
        </h1>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:ring-blue-300 focus:outline-none focus:ring-2"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:ring-blue-300 focus:outline-none focus:ring-2"
              placeholder="Create a password"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:ring-blue-300 focus:outline-none focus:ring-2"
              placeholder="Re-enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} // Accessible label
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
