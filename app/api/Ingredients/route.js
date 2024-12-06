import clientPromise from "../../../lib/mongodb";
import { decode } from "he"; // Use the 'he' library to decode HTML entities

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
        { $project: { ingredients: { $objectToArray: "$ingredients" } } },
        { $unwind: "$ingredients" },
        { $group: { _id: "$ingredients.k" } },
        { $sort: { _id: 1 } }, // Sort by ingredient name
        { $project: { _id: 0, ingredient: "$_id" } }
      ])
      .toArray();

    if (ingredientsList.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No ingredients found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Decode HTML entities and clean escaped quotes
    const decodedIngredients = ingredientsList.map(i => {
      let ingredient = decode(i.ingredient); // Decode HTML entities
      try {
        // Try parsing the ingredient to remove escaped characters (e.g., \" becomes ")
        ingredient = JSON.parse(`"${ingredient}"`);
      } catch (e) {
        // If JSON parsing fails, just return the original ingredient
        console.error("Error parsing ingredient:", e);
      }
      return ingredient;
    });

    return new Response(
      JSON.stringify({ success: true, ingredients: decodedIngredients }),
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
