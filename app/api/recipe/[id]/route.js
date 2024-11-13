import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
// import handleApiError from "../../../components/ApiErrorHandler.js";
// import { ObjectId } from "mongodb";

/**
 * Server-side API route to fetch a single recipe by its ID.
 */
export async function GET(_req, { params }) {
  const { id } = params;

  try {
    // Convert the id to a MongoDB ObjectId
    // const objectId = new ObjectId(id);

    // Connect to the MongoDB client
    const client = await clientPromise;
    const db = client.db("devdb");

    // Fetch the recipe document by its _id
    const recipe = await db.collection("recipes").findOne({ _id: id.toString() });

    if (!recipe) {
      // If the recipe is not found, return a 404 response using NextResponse
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Return the recipe data
    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}