import clientPromise from "../../lib/mongodb";

/**
 * API route handler for fetching all recipes from the 'recipes' collection in MongoDB.
 *
 * @async
 * @function
 * @param {Object} _req - The request object (not used in this case).
 * @param {Object} res - The response object used to send back the result.
 * @returns {Promise<void>} Sends a JSON response containing the fetched recipes or an error message.
 */
 const fetchRecipes  = async (_req, res) => {
  try {
    // Await the MongoDB client connection
    const client = await clientPromise;
    const db = client.db('devdb'); // Connect to the 'devdb' database

    // Fetch all documents from the 'recipes' collection and convert them to an array
    const recipes = await db.collection('recipes').find({}).toArray();

    // Send a 200 (OK) response with the fetched recipes in JSON format
    res.status(200).json(recipes);
  } catch (e) {
    // Log the error to the console for debugging
    console.error(e);

    // Send a 500 (Internal Server Error) response with an error message
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

export default fetchRecipes;
