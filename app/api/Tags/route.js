import clientPromise from "../../../lib/mongodb";

/**

 * API route handler for fetching recipes filtered by multiple tags with pagination.
 * Supports "match any" (OR) and "match all" (AND) filtering, along with limit and page for pagination.

 *
 * @async
 * @function
 * @param {Object} req - The request object containing query parameters.
 * @returns {Promise<void>} Sends a JSON response with filtered recipes or an error message.
 */

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");

    // Fetch all tags from the collection
    const tags = await db.collection("recipes")
      .aggregate([
        { $unwind: "$tags" }, // Unwind the 'tags' array to get individual tag documents
        { $group: { _id: "$tags" } }, // Group by tags to get unique values
        { $sort: { _id: 1 } } // Optionally sort tags alphabetically
      ])
      .toArray();

    // Map the result to get an array of tag names
    const tagList = tags.map(tag => tag._id);

    return new Response(
      JSON.stringify({ success: true, tags: tagList }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching tags:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch tags",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}