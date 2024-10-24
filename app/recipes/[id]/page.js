
import { fetchProductById } from "../../../lib/api";

/**
 * The Home component fetches recipes and displays them in a grid layout.
 * It fetches the recipe data from an API endpoint and passes each recipe
 * to the RecipeCard component for rendering.
 *
 * @async
 * @function Home
 * @returns {JSX.Element} A React component that displays a grid of recipe cards.
 *
 * @example
 * // Usage of Home component
 * <Home />
 */
export default async function RecipeDetail({params}) {
  const { id } = await params;
  let recipe;

  try {
    // Fetch recipe data from the API
    const data = await fetchProductById(id);
    recipe = data; // Assign the fetched recipes to the recipes variable
  } catch (error) {
    console.error("Failed to fetch recipes:", error); // Handle errors gracefully
  }

  /**
   * Renders the Home page layout.
   * @returns {JSX.Element} The main content including recipe grid.
   */
  return (
    <main>
      <h1 className="text-2xl font-bold text-center mb-8">Recipes</h1>
      
    </main>
  );
}