import clientPromise from "../../../../lib/mongodb";

/**
 * Handles the logout functionality by clearing the token cookie and optionally invalidating the token in the database.
 * 
 * @async
 * @function POST
 * @param {Request} req - The HTTP request object.
 * @returns {Response} - The HTTP response indicating success or failure of the logout process.
 */
export async function POST(req) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("your_database_name");

    // Retrieve the token from cookies
    const token = req.cookies.get("token");
    
    if (token) {
      // Invalidate the token in the database
      await db.collection("tokens").deleteOne({ token: token.value });
    }

    // Clear the token cookie by setting it to an empty value and a past expiry date
    return new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict",
        },
      }
    );
  } catch (error) {
    console.error("Logout Error:", error.message);

    // Return a 500 response for unexpected server errors
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
