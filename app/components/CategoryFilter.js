"use client";
import { useRouter } from "next/navigation";
import { fetchCategories, fetchRecipes } from "../../lib/api";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * CategoryFilter component allows users to select a category from a dropdown
 * and filters recipes based on the selected category.
 *
 * @component
 * @param {Object} props
 * @param {string} props.selectedCategory - The currently selected category.
 * @param {function} props.setSelectedCategory - Function to update selected category.
 * @returns {JSX.Element} The rendered component for filtering categories.
 */
const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const search = searchParams.get("search");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(
          Array.isArray(categoriesData) ? categoriesData : categoriesData.categories
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleChange = async (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);

    let url = `/recipe?page=1&limit=20`;

    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (selectedCategory && selectedCategory.trim() !== "") {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }
    router.push(url);
  };

  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="category"
        className="text-[var(--filter-text)] font-bold"
      >
        Categories:
      </label>
      <select
        id="categories"
        value={selectedCategory || ""}
        onChange={handleChange}
        className="px-4 py-2 border-2 rounded-lg bg-[var(--filter-bg)] text-[var(--filter-text)] border-[var(--filter-border)] focus:outline-none focus:ring-2 focus:ring-[var(--button-hover-bg)]"
      >
        <option value="">Default</option>
        {categories.length > 0 ? (
          categories.map((category) => (
            <option
              key={category}
              value={category}
              className="bg-[var(--filter-bg)] text-[var(--filter-text)]"
            >
              {category}
            </option>
          ))
        ) : (
          <option disabled className="bg-[var(--filter-bg)] text-[var(--filter-text)]">
            No categories available
          </option>
        )}
      </select>
    </div>
  );
  };
  
  export default CategoryFilter;
  