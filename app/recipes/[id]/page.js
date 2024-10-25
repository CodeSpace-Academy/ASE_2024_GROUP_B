import { fetchProductById } from "../../../lib/api";
import Image from 'next/image';

/**
 * The RecipeDetail component fetches and displays a specific recipe based on its ID.
 * It shows the recipe's details, including prep time, cooking time, total time, servings, tags, and images.
 * The RecipeDetail component fetches and displays a specific recipe based on its ID.
 * It shows the recipe's details, including prep time, cooking time, total time, servings, and tags.
 *
 * @async
 * @function RecipeDetail
 * @param {Object} props - The props object.
 * @param {Object} props.params - The route parameters, containing the recipe ID.
 * @returns {JSX.Element} A React component that displays recipe details.
 * @function RecipeDetail
 * @param {Object} props - The props object.
 * @param {Object} props.params - The route parameters, containing the recipe ID.
 * @returns {JSX.Element} A React component that displays recipe details.
 *
 * @example
 * // Usage of RecipeDetail component
 * <RecipeDetail params={{ id: 'recipeId' }} />
 * // Usage of RecipeDetail component
 * <RecipeDetail params={{ id: 'recipeId' }} />
 */
export default async function RecipeDetail({ params }) {
  const { id } = params;
export default async function RecipeDetail({ params }) {
  const { id } = params;
  let recipe;

  try {
    // Fetch recipe data from the API
    const data = await fetchProductById(id);
    recipe = data; // Assign the fetched recipe to the recipe variable
    recipe = data; // Assign the fetched recipe to the recipe variable
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    return <p>Failed to load recipe details.</p>;
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  // Destructure with the correct property names
  const { prep, cook, servings, title, description, tags, images } = recipe;

  // Calculate total time
  const totalTime = (prep || 0) + (cook || 0);
    console.error("Failed to fetch recipe:", error);
    return <p>Failed to load recipe details.</p>;
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  // Destructure with the correct property names
  const { prep, cook, servings, title, description, tags } = recipe;

  // Calculate total time
  const totalTime = (prep || 0) + (cook || 0);

  /**
   * Formats time in minutes to a readable string (e.g., "15 mins").
   * @param {number} timeInMinutes - The time in minutes.
   * @returns {string} The formatted time string.
   */
  const formatTime = (timeInMinutes) => {
    return `${timeInMinutes} mins`;
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {/* Display recipe tags */}
      {tags && tags.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Tags:</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      <p className="mb-4">{description}</p>

      {/* Display images */}
      {images && images.length > 0 && (
        <div className="mb-4">
          {/* Use Next.js Image component for optimization */}
          <Image 
            src={images[0]} 
            alt={title} 
            width={600} // Adjust width based on design
            height={400} // Adjust height based on design
            className="w-full h-auto mb-2 rounded-lg"
            priority // Optional: Load the primary image sooner
          />
          {images.length > 1 && (
            <div className="flex overflow-x-auto">
              {images.slice(1).map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${title} ${index + 2}`}
                  width={100} // Fixed width for thumbnails
                  height={100} // Fixed height for thumbnails
                  className="w-32 h-auto rounded-lg mx-1"
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-lg">
        <p>Prep: {formatTime(prep)}</p>
        <p>Cook: {formatTime(cook)}</p>
        <p>Total: {formatTime(totalTime)}</p>
        <p>Serves: {servings}</p>
      </div>
      {/* Add other recipe details here, like ingredients, steps, or images */}
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {/* Display recipe tags */}
      {tags && tags.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Tags:</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      <p className="mb-4">{description}</p>
      <div className="text-lg">
        <p>Prep: {formatTime(prep)}</p>
        <p>Cook: {formatTime(cook)}</p>
        <p>Total: {formatTime(totalTime)}</p>
        <p>Serves: {servings}</p>
      </div>
      {/* Add other recipe details here, like ingredients, steps, or images */}
    </main>
  );
}

