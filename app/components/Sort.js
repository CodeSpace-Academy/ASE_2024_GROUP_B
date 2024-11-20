"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Sort({ selectedSortBy = "", selectedSortOrder = "" }) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState(selectedSortBy);
  const [sortOrder, setSortOrder] = useState(selectedSortOrder);

  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { label: "Prep Time", value: "PREPTIME" },
    { label: "Cook Time", value: "COOKTIME" },
    { label: "Steps", value: "STEPS" },
    { label: "Date", value: "DATE" },
  ];

  const handleSortByChange = (value) => {
    setSortBy(value);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
  };

  const handleApplySort = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    // Update the URL with sorting parameters and preserve other query parameters
    router.push(`/recipe?${params.toString()}`);
    setIsSortOpen(false);
  };

  const handleClearSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sortBy");
    params.delete("sortOrder");

    // Clear the sort parameters and update the URL
    router.push(`/recipe?${params.toString()}`);
    setSortBy("");
    setSortOrder("");
    setIsSortOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
      >
        <span>Sort Options</span>
        <span className="ml-2">{isSortOpen ? "▲" : "▼"}</span>
      </button>

      {isSortOpen && (
        <div className="absolute right-0 top-12 w-72 bg-white border border-gray-300 rounded-lg shadow-lg p-4 space-y-4 z-10">
          <div className="space-y-4">
            <fieldset>
              <legend className="text-lg text-gray-700 font-medium mb-2">
                Sort By:
              </legend>
              {sortOptions.map((option) => (
                <label key={option.value} className="flex items-center text-sm">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={sortBy === option.value}
                    onChange={(e) => handleSortByChange(e.target.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-300 mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend className="text-lg text-gray-700 font-medium mb-2">
                Order:
              </legend>
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="sortOrder"
                  value="asc"
                  checked={sortOrder === "asc"}
                  onChange={(e) => handleSortOrderChange(e.target.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-300 mr-2"
                />
                Ascending
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="sortOrder"
                  value="desc"
                  checked={sortOrder === "desc"}
                  onChange={(e) => handleSortOrderChange(e.target.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-300 mr-2"
                />
                Descending
              </label>
            </fieldset>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleClearSort}
              className="text-white bg-red-600 px-4 py-2 rounded-full hover:bg-red-500 transition duration-200"
            >
              Clear Sort
            </button>
            <button
              onClick={handleApplySort}
              className="text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-500 transition duration-200"
            >
              Apply Sort
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/*"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * AdvancedSorting component provides an interface for users to sort
 * recipes based on different criteria.
 *
 * @component
 * @param {Object} props
 * @param {number} props.page - Current page number for pagination.
 * @returns {JSX.Element} The rendered component for advanced sorting.
 *
export default function AdvancedSorting({ page }) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [selectedSortOrder, setSelectedSortOrder] = useState("asc");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sorting options
  const sortOptions = [
    { value: "name", label: "Recipe Name" },
    { value: "prepTime", label: "Preparation Time" },
    { value: "cookTime", label: "Cooking Time" },
    { value: "difficulty", label: "Difficulty" },
    { value: "createdAt", label: "Date Created" }
  ];

  const handleClearSort = () => {
    setSelectedSortOption("");
    setSelectedSortOrder("asc");

    // Preserve other query parameters
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const tags = searchParams.get("tags");
    const steps = searchParams.get("steps");

    let url = `/recipe?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (tags) url += `&tags=${encodeURIComponent(tags)}`;
    if (steps) url += `&steps=${encodeURIComponent(steps)}`;

    router.push(url);
  };

  const handleApplySorting = () => {
    if (!selectedSortOption) return;

    // Preserve other query parameters
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const tags = searchParams.get("tags");
    const steps = searchParams.get("steps");

    let url = `/recipe?page=${page}&sort=${selectedSortOption}&order=${selectedSortOrder}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (tags) url += `&tags=${encodeURIComponent(tags)}`;
    if (steps) url += `&steps=${encodeURIComponent(steps)}`;

    router.push(url);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
      >
        <span>Advanced Sorting</span>
        <span className="ml-2">{isSortOpen ? "▲" : "▼"}</span>
      </button>

      {/* Sliding Panel *}
      <div
        className={`absolute right-0 top-18 min-w-[280px] mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 space-y-4 z-10 max-h-[500px] flex flex-col transition-all duration-300 ease-in-out ${
          isSortOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 hidden"
        }`}
        style={{ display: isSortOpen ? "flex" : "none" }}
      >
        <div className="flex justify-between mb-4">
          <button
            onClick={handleClearSort}
            className="mt-4 block text-center text-white bg-red-700 rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600 focus:outline-none transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            Clear Sort
          </button>
        </div>

        {/* Sort By Dropdown *}
        <div className="space-y-4">
          <div>
            <label htmlFor="sort-option" className="block text-lg text-gray-700 font-medium mb-2">
              Sort By:
            </label>
            <select
              id="sort-option"
              value={selectedSortOption}
              onChange={(e) => setSelectedSortOption(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg bg-white"
            >
              <option value="">Select Sorting Criteria</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Radios *}
          <div>
            <label className="block text-lg text-gray-700 font-medium mb-2">
              Sort Order:
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="sort-order"
                  value="asc"
                  checked={selectedSortOrder === "asc"}
                  onChange={() => setSelectedSortOrder("asc")}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-300 mr-2"
                />
                Ascending
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="sort-order"
                  value="desc"
                  checked={selectedSortOrder === "desc"}
                  onChange={() => setSelectedSortOrder("desc")}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-300 mr-2"
                />
                Descending
              </label>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleApplySorting}
          className="mt-4 block text-center text-white bg-brown rounded-full px-4 py-2 hover:bg-green-800 transition duration-200 disabled:bg-gray-400"
          disabled={!selectedSortOption}
        >
          Apply Sorting
        </button>
      </div>
    </div>
  );
}*/
