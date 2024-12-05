import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import handleApiError from "../../../components/ApiErrorHandler"; // Assuming error handler is required

/**
 * API route handler for fetching recipes sorted by creation date.
 * 
 * @async
 * @function GET
 * @param {Object} req - The request object containing query parameters for pagination.
 * @returns {Promise<void>} - Sends a JSON response containing the sorted recipes or an error message.
 */
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    const skip = (page - 1) * limit;

    // Fetch recipes sorted by creation date
    const recipes = await db
      .collection("recipes")
      .find()
      .sort({ _id: -1 }) // Assuming `_id` is based on ObjectId, which encodes creation time.
      .skip(skip)
      .limit(limit)
      .toArray();

    if (recipes.length === 0) {
      return NextResponse.json(
        { message: "No recipes found." },
        { status: 200 }
      );
    }

    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error) {
    return handleApiError(NextResponse, error);
  }
}
