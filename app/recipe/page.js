"use client";

import Link from "next/link";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import AdvancedFiltering from "../components/AdvancedFiltering";
import { fetchRecipes } from "../../lib/api";
import { useState, useEffect } from "react";
import Sort from "../components/Sort";

const generateMockRating = () => {
  return (Math.random() * 4 + 1).toFixed(1);
};

export default function RecipePage({ searchParams }) {
  const currentPage = parseInt(searchParams.page) || 1;
  const [sortBy, setSortBy] = useState(searchParams.sortBy || "");
  const [sortOrder, setSortOrder] = useState(searchParams.sortOrder || "");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1); // Add total pages state

  useEffect(() => {
    const fetchAndSortRecipes = async () => {
      setLoading(true);
      try {
        const searchParamsObj = {
          page: currentPage,
          limit: searchParams.limit || 20,
          search: searchParams.search || "",
          category: searchParams.category || "",
          selectedTags: searchParams.tags ? searchParams.tags.split(",") : [],
          selectedSteps: searchParams.steps || "",
          sortBy,
          sortOrder,
        };

        const data = await fetchRecipes(
          searchParamsObj.page,
          searchParamsObj.limit,
          searchParamsObj.search,
          searchParamsObj.category,
          searchParamsObj.selectedTags,
          searchParamsObj.selectedSteps,
          searchParamsObj.sortBy,
          searchParamsObj.sortOrder
        );

        let processedRecipes = data.map(recipe => ({
          ...recipe,
          rating: generateMockRating(),
        }));

        // Only sort by rating if no other sort criteria is specified
        if (!sortBy && sortOrder) {
          processedRecipes = processedRecipes.sort((a, b) => 
            sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating
          );
        }

        setRecipes(processedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSortRecipes();
  }, [searchParams, sortBy, sortOrder, currentPage]);

  const constructPageUrl = (pageNumber) => {
    const params = new URLSearchParams();
    params.set("page", pageNumber.toString());
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.tags) params.set("tags", searchParams.tags);
    if (searchParams.steps) params.set("steps", searchParams.steps);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    
    return `/recipe?${params.toString()}`;
  };

  const noRecipesFound = recipes.length === 0 && !loading;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full md:flex-1">
          <SearchBar />
        </div>
        <div className="flex items-center gap-4">
          <AdvancedFiltering
            selectedCategory={searchParams.category}
            selectedSteps={searchParams.steps}
            selectedTags={searchParams.tags ? searchParams.tags.split(",") : []}
            page={currentPage}
          />
          <Sort
            selectedSortBy={sortBy}
            selectedSortOrder={sortOrder}
          />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-8">Recipes</h1>

      {/* Active Filters Display */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {searchParams.search && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
            Search: {searchParams.search}
          </span>
        )}
        {searchParams.steps && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
            Steps: {searchParams.steps}
          </span>
        )}
        {searchParams.category && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
            Category: {searchParams.category}
          </span>
        )}
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-lg text-gray-600">Loading recipes...</p>
        </div>
      ) : noRecipesFound ? (
        <div className="text-center py-8">
          <p className="text-lg text-red-500">No recipes found with the specified criteria.</p>
        </div>
      ) : (
        // Recipe Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && recipes.length > 0 && (
        <div className="flex justify-center mt-8 items-center gap-4">
          <Link
            href={constructPageUrl(currentPage - 1)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition-colors ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
          >
            ←
          </Link>

          <span className="px-4 text-lg font-semibold text-orange-700">
            Page {currentPage}
          </span>

          <Link
            href={constructPageUrl(currentPage + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-orange-500 hover:bg-orange-600 transition-colors"
          >
            →
          </Link>
        </div>
      )}
    </main>
  );
}