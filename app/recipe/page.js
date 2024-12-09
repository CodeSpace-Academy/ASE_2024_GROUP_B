import Link from "next/link";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import AdvancedFiltering from "../components/AdvancedFiltering";
import { fetchRecipes } from "../../lib/api";

/**
 * Recipe Page that fetches and displays a list of recipes with pagination and filters.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.searchParams - The search parameters from the URL.
 * @returns {JSX.Element} The Recipe Page component.
 */
export default async function RecipePage({ searchParams }) {
  const currentPage = parseInt(searchParams.page) || 1;

  // Construct search parameters object
  const searchParamsToInclude = {
    page: currentPage,
    limit: searchParams.limit || 20,
    search: searchParams.search || "",
    category: searchParams.category || "",
    selectedTags: searchParams.tags ? searchParams.tags.split(",") : [],
    selectedSteps: searchParams.steps || "",
  };

  // Fetch recipes based on search parameters
  const data = await fetchRecipes(
    searchParamsToInclude.page,
    searchParamsToInclude.limit,
    searchParamsToInclude.search,
    searchParamsToInclude.category,
    searchParamsToInclude.selectedTags,
    searchParamsToInclude.selectedSteps
  );

  const recipes = Array.isArray(data) ? data : [];
  const noRecipesFound =
    recipes.length === 0 && searchParams.steps && searchParams.steps !== "";
    const noRecipesFoundInSearch =
    recipes.length === 0 && searchParams.search && searchParams.search !== "";

  return (
    <main>
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>
        <div className="ml-4 flex items-center mt-6">
          <AdvancedFiltering
            selectedCategory={searchParams.category}
            selectedSteps={searchParams.steps}
            selectedTags={searchParams.tags ? searchParams.tags.split(",") : []}
            page={currentPage}
          />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-8">Recipes</h1>

      {/* Display filters applied */}
      <div className="text-center mb-4">
        {searchParams.search && (
          <span className="text-md font-semibold">
            Search:{" "}
            <span className="px-2 py-1 bg-gray-200 rounded-full text-gray-700">
              {searchParams.search}
            </span>
          </span>
        )}
        {searchParams.steps && (
          <span className="text-md font-semibold ml-4">
            Steps:{" "}
            <span className="px-2 py-1 bg-gray-200 rounded-full text-gray-700">
              {searchParams.steps}
            </span>
          </span>
        )}
      </div>

      {/* No recipes found message */}
      {noRecipesFound && (
        <p className="text-center text-lg text-red-500 mb-8">
          No recipes found with the specified number of steps.
        </p>
      )}


      {/* No recipes found message in search */}
      {noRecipesFoundInSearch && (
        <p className="text-center text-lg text-red-500 mb-8">
         Oops! It looks like we do not have that recipe just yet. Maybe try a different search?
        </p>
      )}

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            searchQuery={searchParamsToInclude.search}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 items-center">
        <Link
          href={`/recipe?page=${currentPage - 1}&search=${
            searchParams.search || ""
          }&category=${searchParams.category || ""}`}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${
            currentPage === 1
              ? "bg-gray-300 pointer-events-none opacity-50"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
          aria-label="Previous page"
          title="Previous page"
        >
          ←
        </Link>

        <span className="px-4 text-lg font-semibold text-orange-700">
          Page {currentPage}
        </span>

        <Link
          href={`/recipe?page=${currentPage + 1}&search=${
            searchParams.search || ""
          }&category=${searchParams.category || ""}`}
          className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-orange-500 hover:bg-orange-600"
          aria-label="Next page"
          title="Next page"
        >
          →
        </Link>
      </div>
    </main>
  );
}
