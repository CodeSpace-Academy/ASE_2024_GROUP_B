"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchRecipes } from "../lib/api";
import Loading from "./loading";

const generateMockRating = () => {
  // Generate a random rating between 1 and 5
  return (Math.random() * 4 + 1).toFixed(1); // Random number between 1 and 5 with one decimal point
};

export default function Home({ searchParams }) {
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes on load
    const fetchHighRatedRecipes = async () => {
      const data = await fetchRecipes(
        1, // Page 1 to get the first set of recipes
        100, // Get a large number of recipes to filter top-rated ones
        "",
        "",
        [],
        ""
      );
      
      // Sort recipes by rating (mocked rating)
      const highRatedRecipes = data
        .map((recipe) => ({
          ...recipe,
          rating: generateMockRating(), // Add mock rating to each recipe
        }))
        .sort((a, b) => b.rating - a.rating) // Sort by highest rating
        .slice(0, 10); // Get top 10 or fewer recipes
      
      setRecommendedRecipes(highRatedRecipes);
    };

    fetchHighRatedRecipes();
  }, []);

  return (
    <main>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-center mb-8">Recommended Recipes</h1>
      </div>

      {/* Carousel of Recommended Recipes */}
      <div className="relative mb-8">
        <div className="carousel-container overflow-hidden relative">
          <div className="carousel flex space-x-4">
            {recommendedRecipes.length > 0 ? (
              recommendedRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="carousel-item bg-white p-4 rounded-lg shadow-md w-80"
                >
                  {/* Recipe Card */}
                  <image
                    src={recipe.image || "/default-image.jpg"}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold">{recipe.title}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-orange-500 font-semibold">
                      Rating: {recipe.rating} / 5
                    </span>
                  </div>
                  <Link href={`/recipes/${recipe._id}`} passHref>
                    <button className="mt-4 w-full py-2 bg-orange-500 text-white rounded-md">
                      View Recipe
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              < Loading/>
            )}
          </div>
        </div>
        
        {/* Add navigation arrows for carousel */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white cursor-pointer">
          ←
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white cursor-pointer">
          →
        </div>
      </div>
    </main>
  );
}
