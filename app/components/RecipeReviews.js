"use client";
import { useState, useEffect } from "react";

const RecipeReviews = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guard clause for missing recipeId
    if (!recipeId) {
      setError("Recipe ID is missing.");
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${recipeId}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        const data = await res.json();

        if (data.success) {
          setReviews(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch reviews.");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Unable to fetch reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [recipeId]);

  // Render loading state
  if (loading) {
    return <p>Loading reviews...</p>;
  }

  // Render error state
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  // Render reviews
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          No reviews available for this recipe. Be the first to leave one!
        </p>
      )}
    </section>
  );
};

const ReviewCard = ({ review }) => (
  <div className="border rounded-lg p-4 bg-gray-50">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold">{review.username}</p>
        <p className="text-xs text-gray-500">
          {new Date(review.date).toLocaleDateString()}
        </p>
      </div>
      <p className="font-medium text-teal-600">Rating: {review.rating} / 5</p>
    </div>
    <p className="text-gray-700 mt-2">{review.review}</p>
  </div>
);

export default RecipeReviews;
