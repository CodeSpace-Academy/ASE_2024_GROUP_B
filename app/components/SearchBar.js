"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchRecipes } from "../../lib/api";

/**
 * A search bar component that allows users to search for recipes by title and category.
 * It handles query debouncing, search parameter updates, and redirects based on user input.
 *
 * @component
 * @example
 * return (
 *   <SearchBar />
 * )
 */
const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTextQuery, setTextSearchQuery] = useState(""); // State for the search text input
  const [searchCategoryQuery, setCategorySearchQuery] = useState(""); // State for the category input
  let debounceTimeout = useRef(null); // Ref to hold the debounce timer
  const longQueryTimeout = useRef(null); // Separate timeout for long queries
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTagsQuery, setTagsSearchQuery] = useState(""); // State for the category input
  const [searchStepsQuery, setStepsSearchQuery] = useState(""); // State for the category input
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Initializes the search query state from the URL search parameters.
   * Runs once on component mount and when searchParams changes.
   */
  useEffect(() => {
    const search = searchParams.get("search") || "";
    setTextSearchQuery(search);
    const category = searchParams.get("category") || "";
    setCategorySearchQuery(category);
    const tags = searchParams.get("tags") || "";
    setTagsSearchQuery(tags);
    const steps = searchParams.get("steps") || "";
    setStepsSearchQuery(steps);
  }, [searchParams]);

  // Handle debounce for fetching suggestions
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true); // Set loading to true when fetching begins
      const data = await fetchRecipes(
        1,
        5,
        query,
        searchCategoryQuery,
        searchTagsQuery,
        searchStepsQuery
      ); // Get limited suggestions
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false); // Set loading to false when fetching completes
    }
  };

  /**
   * Handles the search form submission, constructs a new search URL,
   * and redirects the user to the updated URL with query parameters.
   *
   * @param {Event} [e] - The form submission event. Prevents default form behavior if provided.
   */
  const handleSearch = useCallback(
    (event) => {
      if (event) event.preventDefault();

      // Construct the new search query
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (searchTextQuery.trim()) {
        newSearchParams.set("search", encodeURIComponent(searchTextQuery));
      } else {
        newSearchParams.delete("search");
      }

      let url = `recipe/?page=1&limit=20`;

      if (searchTextQuery && searchTextQuery.trim() !== "") {
        url += `&search=${encodeURIComponent(searchTextQuery)}`;
      }

      if (searchCategoryQuery && searchCategoryQuery.trim() !== "") {
        url += `&category=${encodeURIComponent(searchCategoryQuery)}`;
      }

      setIsLoading(true); // Set loading to true when search starts
      // Redirect to the new URL with updated search parameters
      router.push(url);
    },
    [router, searchCategoryQuery, searchTextQuery, searchParams]
  );

  // Debounced search input handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setTextSearchQuery(value);

    // Clear any existing debounce
    clearTimeout(debounceTimeout.current);
    clearTimeout(longQueryTimeout.current);

    // Short query debounce (1-3 characters)
    if (value.trim().length > 0 && value.trim().length <= 3) {
      debounceTimeout.current = setTimeout(() => {
        handleSearch();
      }, 300);
    }

    // Long query debounce (>3 characters)
    if (value.trim().length > 3) {
      longQueryTimeout.current = setTimeout(() => {
        fetchSuggestions(value);
        handleSearch();
      }, 500); // Debounce long queries with a delay of 500ms
    }

    // New debounce for submitting any query after 500ms
    clearTimeout(debounceTimeout.current); // Clear previous timeout
    debounceTimeout.current = setTimeout(() => {
      handleSearch(); // Ensure the query is submitted after 500ms
    }, 500);
  };

  // Handle selection of an auto-suggested title
  const handleSuggestionClick = (title) => {
    setTextSearchQuery(title);
    setShowSuggestions(false); // Close the suggestion pop-up
    performSearch(title); // Fetch the full recipe details
  };

  return (
    <div className="relative flex justify-center mt-8">
      <form onSubmit={handleSearch} className="flex justify-center mt-8">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchTextQuery}
          onChange={handleInputChange}
          className="w-full max-w-lg px-4 py-2 border-2 border-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 text-black"
        />
        <button
          type="submit"
          className={`px-6 py-2 rounded-r-md shadow-md transition-all duration-300 flex items-center justify-center text-white ${
            isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-black hover:bg-gray-800"
          }`}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
         "Search"
        )}
        </button>
      </form>

      {/* Auto-suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full mt-1 w-full max-w-lg bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion._id}
                onClick={() => handleSuggestionClick(suggestion.title)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                {suggestion.title}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No recipes found</div>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchBar;
