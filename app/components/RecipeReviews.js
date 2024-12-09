"use client";
import { useState, useEffect, useRef } from "react";
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

  // Feedback message
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const feedbackTimer = useRef(null);

  // Reference for the form
  const formRef = useRef(null);

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

    return () => {
      clearTimeout(feedbackTimer.current);
    };
  }, [recipeId]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1); // Round to one decimal place
  };

  /**
   * Show feedback message temporarily.
   *
   * @param {string} message - The feedback message to display.
   */
  const showFeedbackMessage = (message) => {
    setFeedbackMessage(message);
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => {
      setFeedbackMessage(null);
    }, 3000);
  };

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

      const successMessage = isEditing
        ? "Review updated successfully!"
        : "Review submitted successfully!";
      if (isEditing) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === editReviewId
              ? { ...r, username, rating, review: reviewText, date: new Date() }
              : r
          )
        );
      } else {
        setReviews((prev) => [
          {
            _id: data.reviewId,
            username,
            date: new Date(),
            rating,
            review: reviewText,
          },
          ...prev,
        ]);
      }

      showFeedbackMessage(successMessage);
      setUsername("");
      setReviewText("");
      setRating(5);
      setIsEditing(false);
      setEditReviewId(null);
    } catch (err) {
      console.error("Error submitting review:", err);
      showFeedbackMessage("Unable to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Delete a review by ID.
   *
   * @param {string} reviewId - The ID of the review to delete.
   */
  const handleDelete = async (reviewId) => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/reviews/${recipeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete review.");
      }

      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      showFeedbackMessage("Review deleted successfully!");
    } catch (err) {
      console.error("Error deleting review:", err);
      showFeedbackMessage("Unable to delete review. Please try again.");
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  /**
   * Initialize editing of an existing review.
   *
   * @param {Object} review - The review to be edited.
   * * @param {string} review._id - The ID of the review to be edited.
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

    // Scroll slightly above the review input form
    const offset = 130; // Adjust this value as needed for the slight upward scroll
    const formElement = formRef.current;
    const formPosition =
      formElement.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: formPosition - offset,
      behavior: "smooth",
    });
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <section className="mt-8 relative">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

       {/* Display Average Rating */}
       <div className="mb-4">
        <p className="text-lg font-medium">Average Rating: {calculateAverageRating()} / 5</p>
      </div>


      <form ref={formRef} onSubmit={handleSubmit} className="mb-6">
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
                {i + 1} Star{i + 1 > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {submitting
            ? "Submitting..."
            : isEditing
            ? "Update Review"
            : "Submit Review"}
        </button>
      </form>

      {feedbackMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-lg text-center">
            {feedbackMessage}
          </div>
        </div>
      )}

      {/* Render Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{review.username}</p>
                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="text-gray-700 mt-2">{review.review}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(review._id)}
                  className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews yet. Be the first to leave a review!</p>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <p className="mb-4">Are you sure you want to delete this review?</p>
            <div className="flex justify-between">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
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
