/**
 * Module dependencies
 */
import bcrypt from "bcryptjs"
import clientPromise from "../../../../lib/mongodb";

/**
 * Handles the POST request to register a new user.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing email and password.
 * @returns {Promise<Response>} - A response object indicating the result of the operation.
 */
export async function POST(req) {
  try {
    // Destructure email and password from the request body
    const { email, password } = await req.json();

    /**
     * Validate input: Ensure email and password are provided
     * @throws {Response} - A 400 error response if email or password is missing.
     */
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    /**
     * Connect to the database
     * @constant {Object} client - The database client
     */
    const client = await clientPromise;
    const db = client.db("devdb");

    /**
     * Check if a user with the given email already exists
     * @constant {Object|null} existingUser - The user document if found, otherwise null
     * @throws {Response} - A 409 error response if the user already exists.
     */
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    /**
     * Hash the password using bcrypt
     * @constant {string} hashedPassword - The hashed password
     */
    const hashedPassword = await bcrypt.hash(password, 10);

    /**
     * Create a new user object
     * @constant {Object} newUser - The user document to be inserted
     */
    const newUser = {
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    /**
     * Insert the new user into the database
     * @constant {Object} result - The result of the insert operation
     */
    const result = await db.collection("users").insertOne(newUser);

    /**
     * Return a success response
     */
    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        userId: result.insertedId,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    /**
     * Handle any unexpected errors
     * @throws {Response} - A 500 error response for internal server errors.
     */
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
