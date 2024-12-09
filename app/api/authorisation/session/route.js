import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Handles GET requests to check the user's session status.
 * 
 * @async
 * @function GET
 * @param {Object} req - The HTTP request object.
 * @returns {Response} - Returns the user's session details or an error.
 */
export async function GET(req) {
  try {
    // Retrieve the token from cookies
    const token = req.cookies.get("token");
    if (!token) {
      return new Response(
        JSON.stringify({ error: "No session found" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify the token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secret);

    // Return user session data
    return new Response(
      JSON.stringify({ user: payload }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Session validation error:", error.message);
    return new Response(
      JSON.stringify({ error: "Invalid session" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
}
