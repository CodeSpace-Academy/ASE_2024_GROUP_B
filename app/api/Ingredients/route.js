import clientPromise from "../../../lib/mongodb";

/**
 * API route handler for fetching all unique ingredients from the database.
 * It fetches the ingredients from the recipes collection and returns them in a structured format.
 *
 * @async
 * @function
 * @returns {Promise<void>} Sends a JSON response with the unique ingredients or an error message.
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");

    // Aggregation query to get unique ingredient keys directly from the database
    const ingredientsList = await db.collection("recipes")
      .aggregate([
        { $project: { ingredients: { $objectToArray: "$ingredients" } } }, // Convert ingredients object to array of key-value pairs
        { $unwind: "$ingredients" }, // Unwind the array of ingredients
        { $group: { _id: "$ingredients.k" } }, // Group by the ingredient key (ingredient name)
        { $project: { _id: 0, ingredient: "$_id" } } // Format the output
      ])
      .toArray();

    if (ingredientsList.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No ingredients found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, ingredients: ingredientsList.map(i => i.ingredient) }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch ingredients" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
