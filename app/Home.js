"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchRecipes } from "../lib/api";
import Loading from "./loading";

const generateMockRating = () => {
  return (Math.random() * 4 + 1).toFixed(1);
};

export default function Home({ searchParams }) {
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighRatedRecipes = async () => {
      setLoading(true);
      try {
        console.log("Fetching recipes..."); // Debug log
        const data = await fetchRecipes(
          1,
          100,
          "",
          "",
          [],
          ""
        );

        console.log("Received data:", data); // Debug log

        // Check if data exists
        if (!data) {
          console.log("No data received");
          setError("No data received from the server");
          return;
        }

        // Make sure data is an array
        if (!Array.isArray(data)) {
          console.log("Data is not an array:", typeof data);
          setError("Invalid data format received");
          return;
        }

        // Process the recipes
        const highRatedRecipes = data
          .map((recipe) => {
            const rating = generateMockRating();
            console.log(`Processing recipe: ${recipe.title}, Rating: ${rating}`); // Debug log
            return {
              ...recipe,
              rating,
            };
          })
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10);

        console.log("Processed recipes:", highRatedRecipes); // Debug log
        setRecommendedRecipes(highRatedRecipes);
      } catch (err) {
        console.error("Error in fetchHighRatedRecipes:", err);
        setError(err.message || "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchHighRatedRecipes();
  }, []);

  // Debug logs for render phase
  console.log("Current state:", {
    loading,
    error,
    recipesCount: recommendedRecipes.length,
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!recommendedRecipes || recommendedRecipes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-lg text-gray-500">No recipes found</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          Recommended Recipes
        </h1>
      </div>

      <div className="relative mb-8">
        <div className="carousel-container overflow-hidden relative">
          <div className="carousel flex space-x-4 overflow-x-auto">
            {recommendedRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="carousel-item flex-none bg-white p-4 rounded-lg shadow-md w-80"
              >
                <img
                  src={recipe.image || "/default-image.jpg"}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-orange-500 font-semibold">
                    Rating: {recipe.rating} / 5
                  </span>
                </div>
                <Link 
                  href={`/recipes/${recipe._id}`}
                  className="block mt-4 w-full py-2 bg-orange-500 text-white rounded-md text-center hover:bg-orange-600 transition-colors"
                >
                  View Recipe
                </Link>
              </div>
            ))}
          </div>
        </div>

        {recommendedRecipes.length > 3 && (
          <>
            <button 
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
              aria-label="Previous recipes"
            >
              ←
            </button>
            <button 
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
              aria-label="Next recipes"
            >
              →
            </button>
          </>
        )}
      </div>
    </main>
  );
}