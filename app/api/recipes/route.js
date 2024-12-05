import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import handleApiError from "../../components/ApiErrorHandler"; // Assuming error handler is required

/**
 * API route handler for fetching paginated recipes with optional filtering by ingredients, category, tags, etc.
 * Supports filtering by either all or any specified ingredients.
 *
 * @async
 * @function GET
 * @param {Object} req - The request object containing query parameters for pagination and filters.
 * @returns {Promise<void>} - Sends a JSON response containing the filtered recipes or an error message.
 */
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const tags = url.searchParams.get("tags")
      ? url.searchParams
          .get("tags")
          .split(",")
          .map((tag) => tag.trim())
      : [];
    const steps = parseInt(url.searchParams.get("steps") || "", 10);
    const topRated = url.searchParams.get("top-rated") === "true"; // Check if requesting top-rated recipes
    const ingredients = url.searchParams.get("ingredients")
      ? url.searchParams.get("ingredients").split(",")
      : [];
    const ingredientsMatchType =
      url.searchParams.get("ingredientsMatchType") || "all"; // Get the match type (either "all" or "any")

    const skip = (page - 1) * limit;

    const pipeline = [];

    if (topRated) {
      pipeline.push(
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "recipeId",
            as: "reviews",
          },
        },
        { $addFields: { averageRating: { $avg: "$reviews.rating" } } },
        { $sort: { averageRating: -1 } },
        { $limit: 10 },
        { $project: { title: 1, category: 1, averageRating: 1, tags: 1 } }
      );
    } else {
      // Filtering stages
      if (search.trim() !== "") {
        pipeline.push({ $match: { title: new RegExp(search, "i") } });
      }

      if (category.trim() !== "") {
        pipeline.push({
          $match: { category: new RegExp(`.*${category}.*`, "i") },
        });
      }

      if (tags.length > 0) {
        pipeline.push({
          $match: { tags: { $in: tags.map((tag) => new RegExp(tag, "i")) } },
        });
      }

      if (!isNaN(steps)) {
        pipeline.push({ $match: { steps: steps } });
      }

      if (ingredients.length > 0) {
        const operator = ingredientsMatchType === "all" ? "$all" : "$in";
        pipeline.push({
          $match: {
            "ingredients.name": {
              [operator]: ingredients.map(
                (ingredient) => new RegExp(ingredient, "i")
              ),
            },
          },
        });
      }

      // Save the total count
      pipeline.push({
        $facet: {
          totalMatches: [{ $count: "total" }], // Total count facet
          paginatedResults: [
            { $skip: skip }, // Pagination
            { $limit: limit }, // Pagination
          ],
        },
      });
    }

    // Execute the pipeline
    const result = await db
      .collection("recipes")
      .aggregate(pipeline, {
        maxTimeMS: 60000,
        allowDiskUse: true,
      })
      .toArray();

    const totalMatches = result[0]?.totalMatches?.[0]?.total || 0;
    const recipes = result[0]?.paginatedResults || [];

    if (recipes.length === 0) {
      return NextResponse.json(
        { message: "No recipes found with the specified filters." },
        { status: 200 }
      );
    }
    // Return total count and paginated recipes
    return NextResponse.json({ totalMatches, recipes }, { status: 200 });
  } catch (error) {
    return handleApiError(NextResponse, error);
  }
}
