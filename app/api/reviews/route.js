import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

/**
 * Handles GET requests to fetch and sort reviews from the MongoDB database.
 *
 * @param {Request} request - The incoming request object containing the URL and query parameters.
 * @returns {Promise<Response>} - A JSON response with the sorted reviews data or an error message.
 */
export async function GET(request) {
  try {
    // Connects to MongoDB
    const client = await clientPromise;
    const db = client.db("devdb");
    const collection = db.collection("reviews");

    // Parse and validate query parameters for sorting
    const url = new URL(request.url);
    let sortField = url.searchParams.get("sortField") || "rating";
    const sortOrder = url.searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Validate sortField to prevent unintended values
    if (!["rating", "date"].includes(sortField)) {
      sortField = "rating";
    }

    // Fetch sorted reviews, ensuring only documents with the specified fields are returned
    const reviews = await collection
      .find({ [sortField]: { $exists: true } })
      .sort({ [sortField]: sortOrder, date: -1 }) // Secondary sort by date if needed
      .toArray();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests to insert multiple reviews into the MongoDB database.
 *
 * @param {Request} request - The incoming request object containing the reviews data in the body.
 * @returns {Promise<Response>} - A JSON response indicating the success of the insertion or an error message.
 */
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");
    const collection = db.collection("reviews");

    const body = await request.json();
    const { reviews } = body;

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid reviews data" },
        { status: 400 }
      );
    }

    const result = await collection.insertMany(reviews);
    // For each review, update the recipe's average rating
    for (let review of reviews) {
      await calculateAverageRating(review.recipe_id);
    }

    return NextResponse.json({
      success: true,
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error("Error inserting reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to insert reviews" },
      { status: 500 }
    );
  }
}
