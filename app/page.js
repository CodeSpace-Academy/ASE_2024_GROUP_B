import Link from 'next/link'; 
import { fetchRecipes } from '../lib/dummyData/fetchSampleData';

export default function Home() {
  const recipes = fetchRecipes();

  return (
    <div>
      <main>
        <h1>Recipes</h1>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe._id}>
              <Link href={`/recipes/${recipe._id}`}>{recipe.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}