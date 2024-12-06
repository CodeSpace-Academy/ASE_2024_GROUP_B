import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handles GET, POST, PUT, and DELETE requests for reviews associated with a specific recipe.
 * Updates the recipe's `averageRating` and `reviewCount` when a review is added, updated, or deleted.
 */

/**
 * GET handler for fetching all reviews of a specific recipe.
 */
export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('devdb');
    const collection = db.collection('reviews');

    const { recipeId } = params;

    // Fetch reviews for the specified recipe, sorted by date in descending order.
    const reviews = await collection
      .find({ recipeId })
      .sort({ date: -1 })
      .project({ username: 1, date: 1, rating: 1, review: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews for recipe:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

/**
 * POST handler for adding a new review to a recipe.
 */
export async function POST(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('devdb');
    const reviewsCollection = db.collection('reviews');

    const { recipeId } = params;
    const { username, rating, review } = await request.json();

    // Validate the incoming request data
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json({ success: false, error: 'Invalid username' }, { status: 400 });
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Invalid rating' }, { status: 400 });
    }
    if (!review || typeof review !== 'string' || review.trim() === '') {
      return NextResponse.json({ success: false, error: 'Invalid review' }, { status: 400 });
    }

    // Insert the new review
    const result = await reviewsCollection.insertOne({
      recipeId,
      username,
      rating,
      review,
      date: new Date(),
    });

    if (!result.insertedId) {
      throw new Error('Failed to insert the review.');
    }

    // Attempt to update recipe stats
    try {
      await updateRecipeStats(recipeId, db);
    } catch (statsError) {
      console.warn('Review added, but failed to update recipe stats:', statsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Review added successfully',
      reviewId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ success: false, error: 'Failed to add review' }, { status: 500 });
  }
}

/**
 * PUT handler for updating an existing review.
 */
export async function PUT(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('devdb');
    const reviewsCollection = db.collection('reviews');

    const { recipeId } = params;
    const { reviewId, username, rating, review } = await request.json();

    // Validate input
    if (!reviewId || typeof reviewId !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid review ID' }, { status: 400 });
    }
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json({ success: false, error: 'Invalid username' }, { status: 400 });
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Invalid rating' }, { status: 400 });
    }
    if (!review || typeof review !== 'string' || review.trim() === '') {
      return NextResponse.json({ success: false, error: 'Invalid review' }, { status: 400 });
    }

    // Update the review
    const result = await reviewsCollection.updateOne(
      { _id: new ObjectId(reviewId), recipeId },
      { $set: { username, rating, review, date: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, error: 'Review not found or no changes detected' }, { status: 404 });
    }

    // Recalculate and update recipe stats
    try {
      await updateRecipeStats(recipeId, db);
    } catch (statsError) {
      console.warn('Review updated, but failed to update recipe stats:', statsError);
    }

    return NextResponse.json({ success: true, message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 });
  }
}

/**
 * DELETE handler for deleting a review.
 */
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('devdb');
    const reviewsCollection = db.collection('reviews');

    const { recipeId } = params;
    const { reviewId } = await request.json();

    // Validate required fields
    if (!reviewId || typeof reviewId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Review ID is required and must be a valid string' },
        { status: 400 }
      );
    }

    // Attempt to delete the review
    const result = await reviewsCollection.deleteOne({
      _id: new ObjectId(reviewId),
      recipeId,
    });

    // Check if the review was successfully deleted
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Review not found or does not belong to the specified recipe' },
        { status: 404 }
      );
    }

    // Recalculate and update recipe stats
    try {
      await updateRecipeStats(recipeId, db);
    } catch (statsError) {
      console.warn('Review deleted, but failed to update recipe stats:', statsError);
    }

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review and updating recipe stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to recalculate and update `averageRating` and `reviewCount` for a recipe.
 * @param {string} recipeId - The ID of the recipe to update.
 * @param {Object} db - The MongoDB database instance.
 */
async function updateRecipeStats(recipeId, db) {
  try {
    const reviewsCollection = db.collection('reviews');
    const recipesCollection = db.collection('recipes');

    const [aggregateData] = await reviewsCollection
      .aggregate([
        { $match: { recipeId } },
        {
          $group: {
            _id: '$recipeId',
            averageRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 },
          },
        },
      ])
      .toArray();

    if (aggregateData) {
      const { averageRating, reviewCount } = aggregateData;
      const result = await recipesCollection.updateOne(
        { _id: new ObjectId(recipeId) },
        { $set: { averageRating, reviewCount } }
      );
      console.log('Recipe stats updated:', result);
    } else {
      console.warn(`No reviews found for recipeId: ${recipeId}`);
    }
  } catch (error) {
    console.error('Error in updateRecipeStats:', error);
    throw error; // Re-throw to ensure it propagates up
  }
}
