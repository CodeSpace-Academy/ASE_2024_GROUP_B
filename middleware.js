import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

/**
 * Middleware to handle JWT verification and route protection.
 *
 *
 * @async
 * @function middleware
 * @param {Request} req - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} - Proceeds to the next middleware or redirects to login.
 */
export async function middleware(req) {
  console.log("Intercepted path:", req.nextUrl.pathname);
   const url = req.nextUrl;

  // Exclude static files (served directly from the public folder)
  if (
    url.pathname.startsWith("/_next") || // Built assets
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/) || // Image files
    url.pathname.startsWith("/public/") // Allow serving static files from the public directory
  ) {
    return NextResponse.next();
  }

  // Retrieve the token from cookies
  const token = req.cookies.get("token");


  if (!token) {
    // Redirect to login if the token is missing
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectTo", url.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Verify the token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secret);

    // Attach user data to headers
    const newHeaders = new Headers(req.headers);
    newHeaders.set("x-user", JSON.stringify(payload));

    // Proceed to the next middleware or route handler
    return NextResponse.next({
      request: {
        headers: newHeaders,
      },
    });
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    // Redirect to login for invalid tokens
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
}

/**
 * Specifies which routes the middleware applies to.
 *
 *
 * @constant
 * @type {Object}
 * @property {Array<string>} matcher - Array of route patterns requiring authentication.
 */
export const config = {
  matcher: ["/favourites"], // Add routes requiring authentication
};
