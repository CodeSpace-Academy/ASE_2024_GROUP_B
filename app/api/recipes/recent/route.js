import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import handleApiError from "../../../components/ApiErrorHandler";

/**
 * API route handler for fetching recipes with optional sorting and pagination.
 *
 * @async
 * @function GET
 * @param {Object} req - The request object containing query parameters for sorting and pagination.
 * @returns {Promise<void>} - Sends a JSON response containing the sorted recipes or an error message.
 */
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const sort = url.searchParams.get("sort") || "default";

    const skip = (page - 1) * limit;

    // Define sort logic
    const sortQuery =
      sort === "default"
        ? { _id: -1 } // Default: sorted by creation date
        : { [sort]: -1 }; // Sort by the specified field in descending order

    // Fetch recipes with the specified sort order
    const recipes = await db
      .collection("recipes")
      .find()
      .sort(sortQuery)
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
