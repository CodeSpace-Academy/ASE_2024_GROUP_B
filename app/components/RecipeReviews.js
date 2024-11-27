"use client";
import { useState, useEffect } from "react";

/**
 * RecipeReviews component for displaying, submitting, editing, and deleting reviews for a specific recipe.
 *
 * @param {Object} props - The component props.
 * @param {string} props.recipeId - The ID of the recipe whose reviews are being displayed.
 * @returns {JSX.Element} The rendered component.
 */
const RecipeReviews = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for review submission
  const [username, setUsername] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // States for editing reviews
  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);

  // States for deleting reviews
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /**
   * Fetch reviews from the API when the component mounts or when recipeId changes.
   */
  useEffect(() => {
    if (!recipeId) {
      setError("Recipe ID is missing.");
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${recipeId}`);
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

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

  /**
   * Handle the submission or editing of a review.
   *
   * @param {React.FormEvent} e - The submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/reviews/${recipeId}`, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: editReviewId,
          username,
          rating,
          review: reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review.");
      }

      if (isEditing) {
        // Update the edited review in the UI
        setReviews((prev) =>
          prev.map((r) =>
            r._id === editReviewId
              ? { ...r, username, rating, review: reviewText, date: new Date() }
              : r
          )
        );
      } else {
        // Add the new review to the list
        setReviews((prev) => [
          { _id: data.reviewId, username, date: new Date(), rating, review: reviewText },
          ...prev,
        ]);
      }

      // Reset the form
      setUsername("");
      setReviewText("");
      setRating(5);
      setIsEditing(false);
      setEditReviewId(null);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Unable to submit review. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle review deletion.
   *
   * @param {string} reviewId - The ID of the review to delete.
   */
  const handleDelete = (reviewId) => {
    setConfirmDelete(reviewId);
  };

  /**
   * Confirm review deletion.
   *
   * @param {boolean} confirm - Whether the user confirms or cancels the deletion.
   */
  const confirmDeleteReview = async (confirm) => {
    if (confirm && confirmDelete) {
      setDeleting(true);
      try {
        const res = await fetch(`/api/reviews/${recipeId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewId: confirmDelete }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to delete review.");
        }

        // Remove the deleted review from the UI
        setReviews((prev) => prev.filter((r) => r._id !== confirmDelete));
        setConfirmDelete(null); // Reset confirmation state
      } catch (err) {
        console.error("Error deleting review:", err);
        setError("Unable to delete review. Please try again later.");
      } finally {
        setDeleting(false);
      }
    } else {
      setConfirmDelete(null); // Reset confirmation state if user cancels
    }
  };

  /**
   * Initialize editing of an existing review.
   *
   * @param {Object} review - The review to be edited.
   * @param {string} review._id - The ID of the review to be edited.
   * @param {string} review.username - The username of the reviewer.
   * @param {string} review.review - The content of the review.
   * @param {number} review.rating - The rating given in the review.
   */
  const handleEdit = (review) => {
    setIsEditing(true);
    setEditReviewId(review._id);
    setUsername(review.username);
    setReviewText(review.review);
    setRating(review.rating);
  };

  // Render loading, error, or review UI
  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

      {/* Review Submission/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Your Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            className="w-full border rounded p-2"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded p-2"
          >
            {[...Array(5)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Star{(i + 1) > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
        >
          {submitting ? "Submitting..." : isEditing ? "Update Review" : "Submit Review"}
        </button>
      </form>

      {/* Render Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border rounded-lg p-4 bg-gray-50">
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
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none font-semibold text-sm px-3 py-1 rounded border"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none font-semibold text-sm px-3 py-1 rounded border"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews yet. Be the first to share your thoughts!</p>
      )}

      {/* On-screen confirmation for deletion */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete this review?</p>
            <div className="flex justify-between">
              <button
                onClick={() => confirmDeleteReview(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => confirmDeleteReview(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecipeReviews;
