"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import AdvancedFiltering from "../components/AdvancedFiltering";
import { fetchRecipes } from "../../lib/api";
import Sort from "../components/Sort";
import { useSearchParams } from "next/navigation";

const generateMockRating = () => (Math.random() * 4 + 1).toFixed(1);

export default function RecipePage() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "";
  const limit = parseInt(searchParams.get("limit")) || 20;

  const constructPageUrl = (pageNumber) => {
    const params = new URLSearchParams();
    params.set("page", pageNumber.toString());
    if (searchParams.get("search")) params.set("search", searchParams.get("search"));
    if (searchParams.get("category")) params.set("category", searchParams.get("category"));
    if (searchParams.get("tags")) params.set("tags", searchParams.get("tags"));
    if (searchParams.get("steps")) params.set("steps", searchParams.get("steps"));
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    return `/recipe?${params.toString()}`;
  };

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const searchParamsObj = {
          page: currentPage,
          limit,
          search: searchParams.get("search") || "",
          category: searchParams.get("category") || "",
          selectedTags: searchParams.get("tags")
            ? searchParams.get("tags").split(",")
            : [],
          selectedSteps: searchParams.get("steps") || "",
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

        let processedRecipes = data.map((recipe) => ({
          ...recipe,
          rating: generateMockRating(),
        }));

        if (!sortBy && sortOrder) {
          processedRecipes = processedRecipes.sort((a, b) =>
            sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating
          );
        }

        setRecipes(processedRecipes);
        setTotalPages(Math.ceil(data.totalCount / limit)); // Update total pages if the API supports pagination
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [currentPage, limit, sortBy, sortOrder, searchParams]);

  const noRecipesFound = recipes.length === 0 && !loading;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full md:flex-1">
          <SearchBar />
        </div>
        <div className="flex items-center gap-4">
          <AdvancedFiltering
            selectedCategory={searchParams.get("category")}
            selectedSteps={searchParams.get("steps")}
            selectedTags={
              searchParams.get("tags") ? searchParams.get("tags").split(",") : []
            }
            page={currentPage}
          />
          <Sort selectedSortBy={sortBy} selectedSortOrder={sortOrder} />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-8">Recipes</h1>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {searchParams.get("search") && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
            Search: {searchParams.get("search")}
          </span>
        )}
        {searchParams.get("steps") && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
            Steps: {searchParams.get("steps")}
          </span>
        )}
        {searchParams.get("category") && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
            Category: {searchParams.get("category")}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-lg text-gray-600">Loading recipes...</p>
        </div>
      ) : noRecipesFound ? (
        <div className="text-center py-8">
          <p className="text-lg text-red-500">
            No recipes found with the specified criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}

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
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${
              currentPage >= totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : 0}
          >
            →
          </Link>
        </div>
      )}
    </main>
  );
}
