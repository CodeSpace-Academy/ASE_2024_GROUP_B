import clientPromise from "../../../lib/mongodb";

/**
 * Handles a GET request to search for recipes in MongoDB using both full-text search and partial matching,
 * with server-side pagination.
 * @param {Request} req - The incoming request, expected to contain searchTerm, page, and limit query parameters.
 * @returns {Response} - A JSON response with paginated search results or an error message.
 */
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get("searchTerm");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    if (!searchTerm) {
      return new Response(
        JSON.stringify({ success: false, error: "Search term is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    // Calculate the number of documents to skip based on the page and limit
    const skip = (page - 1) * limit;

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    /**
     * @description Executes a full-text search for the specified searchTerm.
     * @type {Promise<Array<Object>>} - Promise resolving to an array of matching recipes from the full-text search.
     */

    const textSearchPromise = db
      .collection("recipes")
      .find({ $text: { $search: normalizedSearchTerm } })
      .toArray();

    /**
     * @description Executes a regex search on the title field for partial matches of the searchTerm, case-insensitive.
     * @type {Promise<Array<Object>>} - Promise resolving to an array of matching recipes from the regex search.
     */
    const regexSearchPromise = db
      .collection("recipes")
      .find({ title: { $regex: searchTerm, $options: "i" } })
      .toArray();

    // Await both search results
    const [textResults, regexResults] = await Promise.all([
      textSearchPromise,
      regexSearchPromise,
    ]);

    /**
     * @description Combines and deduplicates results from both full-text and regex searches based on unique _id values.
     * @type {Array<Object>} - Array of unique recipe objects from combined search results.
     */
    const allResults = [
      ...new Map(
        [...textResults, ...regexResults].map((item) => [
          item._id.toString(),
          item,
        ])
      ).values(),
    ];

    // Checks if there are no matching results and return the required empty response
    if (allResults.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No matches found",
          results: [],
          total: 0,
          page,
          limit,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Apply pagination to the combined results
    const paginatedResults = allResults.slice(skip, skip + limit);

    // Return paginated response
    return new Response(
      JSON.stringify({
        success: true,
        results: paginatedResults,
        total: allResults.length,
        page,
        limit,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to perform search:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to perform search",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
