import { fetchProductById } from "../../../lib/api";
import Image from "next/image";
import { Clock, Users } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import RecipeReviews from "../../components/RecipeReviews";

/**
 * The RecipeDetail component fetches and displays a specific recipe based on its ID.
 */
export default async function RecipeDetail({ params }) {
  const { id } = params;
  let recipe;

  try {
    const data = await fetchProductById(id);
    recipe = data;
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error: {error.message}</p>
        <a
          href="/"
          className="mt-4 block text-center text-white bg-brown rounded-full px-4 py-2 hover:bg-green-800 transition duration-200"
        >
          Back to Home
        </a>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-4 text-center">
        <p>Recipe not found</p>
        <a
          href="/"
          className="mt-4 block text-center text-white bg-brown rounded-full px-4 py-2 hover:bg-green-800 transition duration-200"
        >
          Back to Home
        </a>
      </div>
    );
  }

  const {
    prep,
    cook,
    servings,
    title,
    description,
    tags,
    images,
    ingredients,
    instructions,
    nutrition,
  } = recipe;

  const totalTime = (prep || 0) + (cook || 0);

  const formatTime = (timeInMinutes) => {
    return `${timeInMinutes} mins`;
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      {/* Recipe Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <a
          href="/recipe"
          className="mt-4 block text-center text-white bg-brown rounded-full px-4 py-2 hover:bg-green-800 transition duration-200"
        >
          Back to Home
        </a>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-gray-700 mb-4">{description}</p>

      {/* Recipe Overview */}
      <div className="flex flex-wrap gap-6 mb-6">
        {/* Time and Servings */}
        {prep !== undefined && (
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Prep Time</p>
              <p className="font-medium">{formatTime(prep)}</p>
            </div>
          </div>
        )}
        {cook !== undefined && (
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Cook Time</p>
              <p className="font-medium">{formatTime(cook)}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Total Time</p>
            <p className="font-medium">{formatTime(totalTime)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Servings</p>
            <p className="font-medium">{servings}</p>
          </div>
        </div>
      </div>

      {/* Recipe Images */}
      {images.length > 0 && (
        <div className="mb-8">
          <Image
            src={images[0]}
            alt={title}
            width={800}
            height={400}
            className="w-full h-[400px] object-cover rounded-lg mb-4"
            priority
          />
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(1).map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${title} ${index + 2}`}
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredients */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {ingredients && Object.keys(ingredients).length > 0 ? (
                Object.entries(ingredients).map(
                  ([ingredient, quantity], index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        {quantity} {ingredient}
                      </span>
                    </li>
                  )
                )
              ) : (
                <li className="text-gray-500">No ingredients available.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {instructions.length > 0 ? (
                instructions.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-medium">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No instructions available.</li>
              )}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Reviews */}
      {id ? (
        <RecipeReviews recipeId={id} />
      ) : (
        <p className="text-red-500">Loading recipe ID...</p>
      )}
    </main>
  );
}
