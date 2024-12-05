"use client"; 

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchTags } from "../../lib/api";
import CategoryFilter from "./CategoryFilter";
import StepsFilter from "./StepsFilter";

/**
 * AdvancedFiltering component provides an interface for users to filter
 * results by category, tags, and steps. Allows clearing all filters at once.
 *
 * @component
 * @param {Object} props
 * @param {string} props.selectedSteps - Pre-selected steps value.
 * @param {Array} props.selectedTags - Array of pre-selected tags.
 * @param {number} props.page - Current page number for pagination.
 * @returns {JSX.Element} The rendered component for advanced filtering.
 */
export default function AdvancedFiltering({
  selectedSteps = "",
  selectedTags = [],
  page,
}) {
  const [tags, setTags] = useState([]);
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [localSelectedSteps, setLocalSelectedSteps] = useState(selectedSteps);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(true);
  const [showStepsFilter, setShowStepsFilter] = useState(true);
  const [showTagsFilter, setShowTagsFilter] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  useEffect(() => {
    async function loadTags() {
      try {
        const tagsData = await fetchTags();
        if (tagsData && !tagsData.error) {
          setTags(tagsData);
        } else {
          console.error("Failed to fetch tags:", tagsData.error);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }
    loadTags();
  }, []);

  const handleTagChange = (tag) => {
    setLocalSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const handleClearAllFilters = () => {
    setLocalSelectedTags([]);
    setSelectedCategory(null);
    setLocalSelectedSteps("");

    router.push(`/recipe?page=${page}`);

  };

  const handleClearCategoryFilter = () => {
    setSelectedCategory(null);
  
    // Remove the category filter from the URL to show all recipes
    const tagsParam = localSelectedTags.length > 0 ? `&tags=${localSelectedTags.join(",")}` : '';
    const stepsParam = localSelectedSteps ? `&steps=${localSelectedSteps}` : '';
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  
    router.push(`/recipe?page=${page}${tagsParam}${stepsParam}${searchParam}`);
  };

  const handleClearTags = () => {
    setLocalSelectedTags([]);
    const tagsParam = ""; 
    const categoryParam = selectedCategory ? `&category=${selectedCategory}` : '';
    const stepsParam = localSelectedSteps ? `&steps=${localSelectedSteps}` : '';
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';


    router.push(`/recipe?page=${page}${searchParam}${categoryParam}${stepsParam}`); 

  };

  const handleApplyFilters = () => {
    const tagsParam = localSelectedTags.join(",");
    const categoryParam = selectedCategory ? `&category=${selectedCategory}` : "";
    const stepsParam = localSelectedSteps ? `&steps=${localSelectedSteps}` : "";
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";

    router.push(`/recipe?page=${page}${searchParam}&tags=${tagsParam}${categoryParam}${stepsParam}`);
  };
  
    return (
      <div className="relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center px-4 py-2 text-sm font-medium bg-[var(--button-bg)] text-[var(--button-text)] border-[var(--filter-border)] rounded-full hover:bg-[var(--button-hover-bg)] hover:text-[var(--button-hover-text)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
        >
          <span>Advanced Filters</span>
          <span className="ml-2">{isFilterOpen ? "▲" : "▼"}</span>
        </button>
  
        {/* Sliding Panel */}
        <div
          className={`absolute right-0 top-18 min-w-[280px] mt-2 bg-[var(--filter-bg)] border-[var(--filter-border)] rounded-lg shadow-lg p-4 space-y-4 z-10 max-h-[500px] flex flex-col transition-all duration-300 ease-in-out ${
            isFilterOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 hidden"
          }`}
          style={{ display: isFilterOpen ? "flex" : "none" }}
        >
          <div className="flex justify-between mb-4">
            <button
              onClick={handleClearAllFilters}
              className="mt-4 block text-center bg-red-700 text-[var(--button-text)] rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600 focus:outline-none transition duration-200 ease-in-out shadow-md hover:shadow-lg"
            >
              Clear All Filters
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCategoryFilter((prev) => !prev)}
                className="mt-4 block text-center bg-[var(--tag-bg)] text-[var(--tag-text)] rounded-full px-3 py-1.5 text-xs hover:bg-[var(--tag-hover-bg)] hover:text-[var(--tag-hover-text)] transition duration-200"
              >
                {showCategoryFilter ? "Hide" : "Show"} Category
              </button>
              <button
                onClick={() => setShowTagsFilter((prev) => !prev)}
                className="mt-4 block text-center bg-[var(--tag-bg)] text-[var(--tag-text)] rounded-full px-3 py-1.5 text-xs hover:bg-[var(--tag-hover-bg)] hover:text-[var(--tag-hover-text)] transition duration-200"
              >
                {showTagsFilter ? "Hide" : "Show"} Tags
              </button>
              <button
                onClick={() => setShowStepsFilter((prev) => !prev)}
                className="mt-4 block text-center bg-[var(--tag-bg)] text-[var(--tag-text)] rounded-full px-3 py-1.5 text-xs hover:bg-[var(--tag-hover-bg)] hover:text-[var(--tag-hover-text)] transition duration-200"
              >
                {showStepsFilter ? "Hide" : "Show"} Steps
              </button>
            </div>
          </div>
  
          {showCategoryFilter && (
            <CategoryFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )}
          {selectedCategory && (
            <button
              onClick={handleClearCategoryFilter}
              className="mt-4 block text-center bg-red-700 text-[var(--button-text)] rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600 focus:outline-none transition duration-200 ease-in-out shadow-md hover:shadow-lg"
            >
              Clear Category Filter
            </button>
          )}
  
          {showTagsFilter && (
            <div className="space-y-4 max-h-[200px] overflow-y-auto">
              <fieldset>
                <legend className="text-lg font-medium text-[var(--filter-text)]">
                  Tags:
                </legend>
                {localSelectedTags.length > 0 && (
                  <button
                    onClick={handleClearTags}
                    className="mt-4 block text-center bg-[var(--button-bg)] text-[var(--button-text)] rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600 focus:outline-none transition duration-200 ease-in-out shadow-md hover:shadow-lg"
                  >
                    Clear All Tags
                  </button>
                )}
                <div className="space-y-2">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <label
                        key={tag}
                        className="flex items-center text-sm text-[var(--filter-text)]"
                      >
                        <input
                          type="checkbox"
                          name="tags"
                          value={tag}
                          onChange={() => handleTagChange(tag)}
                          checked={localSelectedTags.includes(tag)}
                          className="h-3 w-3 border-[var(--filter-border)] rounded focus:ring-2 focus:ring-blue-300 mr-2"
                        />
                        <span>{tag}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--tag-text)]">
                      Loading tags...
                    </p>
                  )}
                </div>
              </fieldset>
            </div>
          )}
  
          {showStepsFilter && (
            <StepsFilter
              selectedSteps={localSelectedSteps}
              setSelectedSteps={setLocalSelectedSteps}
            />
          )}
  
          <button
            type="button"
            onClick={handleApplyFilters}
            className="mt-4 block text-center bg-[var(--button-bg)] text-[var(--button-text)] rounded-full px-4 py-2 hover:bg-[var(--button-hover-bg)] hover:text-[var(--button-hover-text)] transition duration-200"
          >
            Apply
          </button>
        </div>
      </div>
    );
  }
  