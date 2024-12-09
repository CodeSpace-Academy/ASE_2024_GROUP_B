import clientPromise from "../../../lib/mongodb";

/**
 * API route handler for fetching all unique categories from the recipes collection.
 * File location: app/api/categories/route.js
 *
 * @async
 * @function
 * @returns {Promise<void>} Sends a JSON response containing all unique categories or an error message.
 */
export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("devdb");

    // Fetch all unique categories
    const categories = await db.collection("recipes").distinct("category");

    // Return successful response
    return new Response(
      JSON.stringify({ 
        success: true,
        categories,
        total: categories.length 
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    // Log any errors
    console.error('Failed to fetch categories:', error);

    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch categories",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}