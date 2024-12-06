import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("devdb");
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate a JWT token
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h", // Token expiration time
    });

    const cookieOptions = [
      `token=${token}`,
      "Path=/",
      "HttpOnly",
      "Max-Age=3600", // 1 hour
      process.env.NODE_ENV === "production" ? "Secure" : "",
    ].join("; ");

    return new Response(
      JSON.stringify({
        message: "Login successful",
        userId: user._id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieOptions,
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}