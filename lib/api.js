/**
 * Fetches paginated recipes from the '/api/recipes' endpoint.
 *
 * This function sends a GET request with pagination parameters to retrieve recipe data.
 * If the request fails, it returns an error message.
 *
 * @async
 * @function fetchRecipes
 * @param {number} page - The page number to fetch (default is 1).
 * @param {number} limit - The number of recipes per page (default is 20).
 * @param {string} search - The search term for filtering recipes (optional).
 * @param {string} category - The category for filtering recipes (optional).
 * @param {string} tags - The tags for filtering (optional).
 * @param {string} steps - The number of steps to filter by (optional).
 * @param {Array} ingredients - The ingredients for filtering (optional).
 * @param {boolean} topRated - Whether to fetch top-rated recipes (default is false).
 * @returns {Promise<Object>} - A promise that resolves to an array of recipe objects if successful, or an error message if failed.
 */
export async function fetchRecipes(
  page,
  limit,
  search,
  category,
  tags,
  steps,
  ingredients = [],
  topRated = false,
  ingredientsMatchType
) {
  try {
    // Construct the URL
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes`);
    // Append query parameters only if they are defined
    if (page !== undefined) {
      url.searchParams.append("page", page);
    }
    if (limit !== undefined) {
      url.searchParams.append("limit", limit);
    }
    if (search) {
      url.searchParams.append("search", search);
    }
    if (category) {
      url.searchParams.append("category", category);
    }
    if (tags.length > 0) {
      url.searchParams.append("tags", tags.join(","));
    }
    if (steps) {
      url.searchParams.append("steps", steps); // Filter by steps if provided
    }
    if (topRated) {
      url.searchParams.append("top-rated", "true"); // Indicate to fetch top-rated recipes
    }
    if (ingredients.length > 0) {
      url.searchParams.append("ingredients", ingredients.join(","));
    }
    if (ingredientsMatchType) {
      url.searchParams.append("ingredientsMatchType", ingredientsMatchType); // Add ingredients match type
    }

    console.log("url:", url); // Log the constructed URL
    const response = await fetch(url);

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch recipes");
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle and return any errors that occur during the fetch
    console.error(`Error fetching recipes: ${error.message}`);
    return { error: `Error fetching recipes: ${error.message}` };
  }
}
/**
 * Fetches a single product by its ID from the '/api/products/[id]' endpoint.
 *
 *
 * This function sends a GET request to the API to retrieve product data based on the provided ID
 * and returns it as a JSON object. If the request fails, it returns an error message.
 *
 * @async
 * @function fetchProductById
 * @param {string} id
 * @param {string} id
 * @returns {Promise<Object|string>}
 * @throws {Error}
 *
 * @example
 * fetchProductById('12345')
 *   .then(product => {
 *     console.log(product); // Logs the product data
 *   })
 *   .catch(error => {
 *     console.error(error); // Logs the error message
 *   });
 */
export async function fetchProductById(id) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe/${id}`;
    // console.log("Fetching product from URL:", url);  // Log URL being fetched
    // Log the URL being fetched
    console.log(
      "Fetching product from URL:",
      `${process.env.BASE_URL}/api/recipe/${id}`
    );

    const response = await fetch(url);
    console.log("Response status:", response.status); // Log response status

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error data:", errorData); // Log error details if response is not OK
      throw new Error(errorData.message || "Failed to fetch product");
    }

    // Parse and return the response data
    const data = await response.json();
    //  console.log("Fetched product data:", data);  // Log fetched data
    return data;
  } catch (error) {
    // Handle and return any errors that occur during the fetch
    console.error(`Error fetching product: ${error.message}`);
    return { error: `Error fetching product: ${error.message}` };
  }
}
/**
 * Fetches categories from the '/api/categories' endpoint.
 *
 * This function sends a GET request to retrieve category data.
 * If the request fails, it returns an error message.
 *
 * @async
 * @function fetchCategories
 * @returns {Promise<Object>} - A promise that resolves to an array of category objects if successful, or an error message if failed.
 */
export async function fetchCategories() {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
    }/api/categories`;
    //console.log("Fetching categories from URL:", url);  // Log URL being fetched
    const response = await fetch(url);
    console.log("Response status:", response.status); // Log response status
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error data:", errorData); // Log error details if response is not OK
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }
    const data = await response.json();
    console.log("Fetched categories data:", data); // Log fetched data
    return data;
  } catch (error) {
    console.error(`Error fetching categories: ${error.message}`);
    return { error: `Error fetching categories: ${error.message}` };
  }
}
/**
 * Fetches categories from the '/api/Tags' endpoint.
 *
 * This function sends a GET request to retrieve Tags data.
 * If the request fails, it returns an error message.
 *
 * @async
 * @function fetchTags
 * @returns {Promise<Object>} - A promise that resolves to an array of Tags if successful, or an error message if failed.
 */
export async function fetchTags() {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
    }/api/Tags`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch tags");
    }
    const data = await response.json();
    return data.tags;
  } catch (error) {
    console.error(`Error fetching tags: ${error.message}`);
    return { error: `Error fetching tags: ${error.message}` };
  }
}

/**
 * Fetches reviews for a specific recipe by its ID.
 *
 * This function sends a GET request to the '/api/reviews/{recipeId}' endpoint and retrieves the reviews for the specified recipe.
 * It parses the JSON response and logs any errors encountered during the fetch process.
 *
 * @async
 * @function fetchReviews
 * @param {string} recipeId - The unique identifier for the recipe whose reviews are being fetched.
 * @returns {Promise<Object>} - A promise that resolves to the reviews data if successful, or an error message if failed.
 *
 * @example
 * fetchReviews('774b0956-1286-48bf-85a2-7f5530d66deb')
 *   .then(reviews => {
 *     console.log(reviews); // Logs the reviews data for the recipe
 *   })
 *   .catch(error => {
 *     console.error(error); // Logs the error message
 *   });
 */
const fetchReviews = async (recipeId) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews/${recipeId}`;
    console.log("Fetching reviews from URL:", url); // Log the URL being requested

    const res = await fetch(url);

    // Log the response status and body (if applicable)
    console.log("Response status:", res.status);

    if (!res.ok) {
      // If response is not okay, handle and throw error
      const errorData = await res.json(); // Attempt to parse error JSON
      console.error("Error data:", errorData); // Log error data
      throw new Error(
        errorData.message || `Failed to fetch reviews, Status: ${res.status}`
      );
    }

    // Parse and log the successful response data
    const data = await res.json();
    console.log("Fetched reviews data:", data); // Log the fetched reviews
    return data;
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    console.error("Error fetching reviews:", error.message);
  }
};

/**
 * Fetches ingredients from the '/api/Ingredients' endpoint.
 *
 * This function sends a GET request to retrieve ingredients data.
 * If the request fails, it returns an error message.
 *
 * @async
 * @function fetchIngredients
 * @returns {Promise<Object>} - A promise that resolves to an ingredients object if successful, or an error message if failed.
 */
export async function fetchIngredients() {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
    }/api/Ingredients`;
    const response = await fetch(url);

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch ingredients");
    }

    const data = await response.json();

    // Ensure the 'ingredients' key is accessed correctly
    if (data.success && Array.isArray(data.ingredients)) {
      return data.ingredients;
    }

    // Handle unexpected API responses
    throw new Error(data.message || "Unexpected API response structure");
  } catch (error) {
    console.error(`Error fetching ingredients: ${error.message}`);
    return { error: `Error fetching ingredients: ${error.message}` };
  }
}
