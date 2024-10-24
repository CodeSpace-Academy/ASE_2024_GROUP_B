// Import the recipes array from the file
import { recipes } from './sampleData.js';

// Function to fetch all recipes
export const fetchRecipes = () => {
  try {
    return recipes;
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return [];
  }
};

// Function to fetch a recipe by its ID
export const fetchRecipeById = (id) => {
  try {
    // Find the recipe using `_id`
    return recipes.find((recipe) => recipe._id === id);
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    return null;
  }
};