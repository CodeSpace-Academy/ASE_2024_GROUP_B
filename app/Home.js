"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchRecipes } from "../lib/api";
import Loading from "./loading";

const generateMockRating = () => {
  return (Math.random() * 4 + 1).toFixed(1);
};

export default function Home({ searchParams }) {
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch recipes on load
    const fetchHighRatedRecipes = async () => {
      try {
        const data = await fetchRecipes(1, 100, "", "", [], "");
        const highRatedRecipes = data.recipes
          .map((recipe) => ({
            ...recipe,
            rating: generateMockRating(),
          }))
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10);

        setRecommendedRecipes(highRatedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighRatedRecipes();
  }, []);

  return (
    <main
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 text-center text-[var(--home-text)] py-12 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">Welcome to Recipe Paradise!</h1>
          <p className="text-lg mt-2">
            Explore top-rated recipes curated just for you.
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Recommended Recipes</h2>

          {/* Carousel */}
          <div className="relative">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="carousel-container flex overflow-x-scroll space-x-6 scrollbar-hide">
                {recommendedRecipes.map((recipe) => (
                  <div
                    key={recipe._id}
                    className="bg-[var(--recipe-bg)] p-4 rounded-lg shadow-md flex-shrink-0 w-72 flex flex-col"
                  >
                    <Image
                      src={recipe.images[0] || "/default-image.jpg"} // Ensure fallback
                      alt={recipe.title}
                      width={288} // Matches w-72 (72 * 4px = 288px)
                      height={192} // Matches h-48 (48 * 4px = 192px)
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <h3 className="text-xl font-semibold mt-4 text-[var(--recipe-title-text)] text-center">
                      {recipe.title}
                    </h3>
                    <p className="text-[var(--rating-bg)] mt-2 text-center">
                      Rating: {recipe.rating} / 5
                    </p>

                    {/* Push button to the bottom */}
                    <div className="mt-auto">
                      <Link href={`/recipes/${recipe._id}`} passHref>
                        <button className="w-full py-2 bg-[var(--viewRecipe-bg)] text-[var(--home-text)] rounded-md hover:bg-[var(--button-hover)]">
                          View Recipe
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}