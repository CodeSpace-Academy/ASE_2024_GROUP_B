import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

/**
 * Middleware to handle JWT token verification using jose.
 */
export async function middleware(req) {
  // Retrieve the token from cookies
  const token = req.cookies.get("token");

  if (!token) {
    console.log("No token found in cookies.");
    return new Response("Unauthorized: No token found", { status: 401 });
  }

  try {
    // Verify the token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secret);

    // Attach the decoded user information to the request object
    req.user = payload;
    console.log("Token verified", payload);

    // Proceed with the request
    return NextResponse.next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return new Response("Unauthorized: Invalid token", { status: 401 });
  }
}

// Apply the middleware only to specific routes
export const config = {
  matcher: ["/api/test"],
};
