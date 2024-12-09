import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = cookies();

  // Get the token from the cookie
  const token = cookieStore.get("token"); // Matches the key set in login

  if (!token) {
    console.error("No token found in cookies");
    return new Response(
      JSON.stringify({ error: "Unauthorized: No token found" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Verify the token and extract the payload
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token.value, secretKey);

    console.log("Decoded token:", decoded);

    // Return the userId from the decoded token
    return new Response(
      JSON.stringify({ userId: decoded.userId }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying token:", error);
    return new Response(
      JSON.stringify({ error: "Invalid or expired token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
}
