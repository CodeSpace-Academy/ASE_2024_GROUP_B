import { NextResponse } from "next/server";

/**
 * Handles errors for API responses by logging the error and sending a standardized error response.
 * @param {object} resType - The response type, such as NextResponse, for returning JSON responses.
 * @param {object} error - The error object caught in the API route.
 */
export default function handleApiError(resType, error) {
  console.error("API Error:", error);

  // Determine the status code and error message based on the error type
  let statusCode = 500;
  let message = "An unexpected error occurred";

  if (error.name === "ValidationError") {
    // Handle validation errors (e.g., missing or invalid parameters)
    statusCode = 400;
    message = error.message || "Invalid request parameters";
  } else if (error.name === "AuthenticationError") {
    // Handle authentication errors (e.g., unauthorized access)
    statusCode = 401;
    message = error.message || "Unauthorized access";
  } else if (error.name === "MongoError") {
    statusCode = 500;
    message = "A database error occurred";
  } else if (error.statusCode) {
    // Use custom status code if provided in the error
    statusCode = error.statusCode;
    message = error.message || message;
  }

  // Include additional details if available (for example, error.stack in development mode)
  const errorDetails = process.env.NODE_ENV === "development" ? error.stack : null;

  return resType.json(
    {
      status: "error",
      statusCode,
      message,
      ...(errorDetails && { details: errorDetails }),
    },
    { status: statusCode }
  );
}