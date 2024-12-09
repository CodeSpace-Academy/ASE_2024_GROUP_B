import clientPromise from './mongodb';

/**
 * Recalculates and updates the average rating for a given recipe in MongoDB.
 *
 * @param {string} recipeId - The ID of the recipe whose average rating needs to be updated.
 * @returns {Promise<number>} - The newly calculated average rating.
 */
export async function calculateAverageRating(recipeId) {
  try {
    const client = await clientPromise;
    const db = client.db('devdb');
    const reviewsCollection = db.collection('reviews');
    const recipesCollection = db.collection('recipes'); // Assuming there's a 'recipes' collection

    // Fetch all reviews for the given recipe
    const reviews = await reviewsCollection.find({ recipe_id: recipeId }).toArray();

    if (reviews.length === 0) {
      return 0; // No reviews, set average rating to 0
    }

    // Calculate the total sum of ratings
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update the recipe's average rating in the 'recipes' collection
    await recipesCollection.updateOne(
      { _id: recipeId },
      { $set: { average_rating: averageRating } }
    );

    return averageRating;
  } catch (error) {
    console.error('Error calculating average rating:', error);
    throw new Error('Failed to calculate average rating');
  }
}
