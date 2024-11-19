"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchCategories } from "../../lib/api";

/**
 * CategoryFilter component allows users to select a category from a dropdown
 * and filters recipes based on the selected category.
 *
 * @component
 * @param {Object} props
 * @param {string} props.selectedCategory - The currently selected category
 * @param {function} props.setSelectedCategory - Function to update selected category
 * @returns {JSX.Element} The rendered component for filtering categories
 */
const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const search = searchParams.get("search");

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categoriesData = await fetchCategories();
        setCategories(
          Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = async (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);

    let url = `/recipe?page=1&limit=20`;

    if (search?.trim()) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (selectedCategory?.trim()) {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }

    router.push(url);
  };

  if (error) {
    return (
      <div className="text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <label 
        htmlFor="categories" 
        className="text-gray-700 font-bold"
      >
        Categories:
      </label>
      <select
        id="categories"
        value={selectedCategory || ""}
        onChange={handleChange}
        className="px-4 py-2 border-2 border-gray-400 rounded-lg bg-white disabled:bg-gray-100"
        disabled={isLoading}
      >
        <option value="">Default</option>
        {isLoading ? (
          <option disabled>Loading categories...</option>
        ) : categories?.length > 0 ? (
          categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))
        ) : (
          <option disabled>No categories available</option>
        )}
      </select>
    </div>
  );
};

export default CategoryFilter;