/**
 * Fetches recipes from the '/api/recipes' endpoint.
 * 
 * This function sends a GET request to the API to retrieve recipe data and returns it as a JSON object. 
 * If the request fails, it returns an error message.
 *
 * @async
 * @function fetchRecipes
 * @returns {Promise<Object[]|string>} - A promise that resolves to an array of recipe objects if the request is successful, 
 *                                       or an error message string if the request fails.
 * @throws {Error} - Throws an error if the API request fails or if the server returns an error message.
 *
 * @example
 * fetchRecipes()
 *   .then(recipes => {
 *     console.log(recipes); // Logs the array of recipes
 *   })
 *   .catch(error => {
 *     console.error(error); // Logs the error message
 *   });
 */
export async function fetchRecipes() {
  try {
    // Log the URL being fetched
    console.log("Fetching recipes from URL:", "/api/recipes");

    // Make API request to fetch recipes from your endpoint
    const response = await fetch("http://localhost:3000/api/recipes");

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch recipes");
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle and return any errors that occur during the fetch
    return `Error fetching recipes: ${error.message}`;
  }
}


/**
 * Fetches a single product by its ID from the '/api/products/[id]' endpoint.
 * 
 * This function sends a GET request to the API to retrieve product data based on the provided ID
 * and returns it as a JSON object. If the request fails, it returns an error message.
 *
 * @async
 * @function fetchProductById
 * @param {string} id - The ID of the product to fetch.
 * @returns {Promise<Object|string>} - A promise that resolves to the product object if the request is successful,
 *                                     or an error message string if the request fails.
 * @throws {Error} - Throws an error if the API request fails or if the server returns an error message.
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
      // Log the URL being fetched
      console.log("Fetching product from URL:", `/api/recipes/${id}`);
  
      // Make API request to fetch the product by its ID from your endpoint
      const response = await fetch(`http://localhost:3000/api/recipe/${id}`);
  
      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch product");
      }
  
      // Parse and return the response data
      const data = await response.json();
      return data;
    } catch (error) {
      // Handle and return any errors that occur during the fetch
      return `Error fetching product: ${error.message}`;
    }
  }
  