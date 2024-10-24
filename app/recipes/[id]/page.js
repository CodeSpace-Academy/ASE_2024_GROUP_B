export default async function SingleRecipe({ params }) {
  // Await params to ensure it's resolved before destructuring
  const { id } = await params; // Await the params here
  
  return (
    <div>
      <main>
        {/* Display title and description */}
        <h1>this is our Dynamic Recipe Detail Page</h1>

        {/* Display time and servings */}
        <div>
        </div>

        {/* Display recipe tags */}
        <div>
        </div>

        {/* Display images */}
        <div>
        </div>

        {/* Display ingredients */}
        <ul>
        </ul>

        {/* Display instructions */}
        <div>
        </div>
      </main>
    </div>
  );
}
