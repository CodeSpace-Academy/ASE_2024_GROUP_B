"use client";

import { useState } from "react";

export default function ShoppingList({ ingredients }) {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [message, setMessage] = useState("");
  // Fallback to an empty array if ingredients is not valid
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleAddAll = () => {
    setSelectedIngredients(ingredients);
    setMessage("All ingredients added!");
  };

  const handleAddSelected = () => {
    // Add selected ingredients to the shopping list (implementation logic here)
    setMessage("Selected ingredients added!");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
      {safeIngredients.length === 0 ? (
        <p>No ingredients available.</p>
      ) : (
        <ul>
          {safeIngredients.map((ingredient, index) => (
            <li key={index} className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" />
              {ingredient.name} - {ingredient.quantity}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={handleAddAll}
        className="bg-green-600 text-white px-4 py-2 rounded-lg mr-4 hover:bg-green-800"
      >
        Add All Ingredients
      </button>
      <button
        onClick={handleAddSelected}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-800"
      >
        Add Selected Ingredients
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
