const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');
require('dotenv').config({ path: '.env.local' });

const url = process.env.MONGODB_URI;
if (!url) {
  console.error("MongoDB URI is not defined in the environment variables.");
  process.exit(1);
}

const client = new MongoClient(url);

/**
 * Creates reviews for each recipe in the database that does not already have reviews.
 * Connects to the MongoDB database, retrieves all recipes, and generates a set number of 
 * fake reviews for each recipe without existing reviews. Inserts the generated reviews 
 * into the 'reviews' collection.
 *
 * @async
 * @function createReviews
 * @returns {Promise<void>} A promise that resolves when the reviews are created.
 */
async function createReviews() {
  try {
    await client.connect();
    const db = client.db('devdb');
    const reviewsCollection = db.collection('reviews');
    const recipes = await db.collection('recipes').find().toArray();

    if (recipes.length === 0) {
      console.log("No recipes found in the database.");
      return;
    }

    const reviewCount = 3;

    for (const recipe of recipes) {
      // Check if reviews already exist for the recipe
      const existingReviews = await reviewsCollection.find({ recipeId: recipe._id }).count();
      if (existingReviews > 0) {
        console.log(`Reviews already exist for recipe: ${recipe._id}`);
        continue;
      }

      // Generate fake reviews for the recipe
      const reviews = [];
      for (let i = 0; i < reviewCount; i++) {
        reviews.push({
          recipeId: recipe._id,
          username: faker.internet.username(),
          date: faker.date.recent(90),
          rating: faker.number.int({ min: 1, max: 5 }),
          review: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
        });
      }

      // Insert the reviews into the collection
      const result = await reviewsCollection.insertMany(reviews);
      console.log(`Inserted ${result.insertedCount} reviews for recipe: ${recipe._id}`);
    }

    console.log("Reviews created successfully!");
  } catch (error) {
    console.error("Error creating reviews:", error);
  } finally {
    await client.close();
  }
}

// Execute the createReviews function to populate reviews
createReviews();
