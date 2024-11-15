"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * StepsFilter component allows users to input a number for steps
 * and filters results based on the input value.
 *
 * @component
 * @param {Object} props
 * @param {string} props.selectedSteps - The current steps value.
 * @param {function} props.setSelectedSteps - Function to update steps.
 * @returns {JSX.Element} The rendered component for filtering by steps.
 */
const StepsFilter = ({ selectedSteps, setSelectedSteps }) => {
  const router = useRouter();

  const handleInputChange = (event) => {
    setSelectedSteps(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (selectedSteps && !isNaN(selectedSteps)) {
      const url = `/recipe?page=1&steps=${selectedSteps}`;
      router.push(url);
    } else {
      alert("Please enter a valid number for steps.");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <label htmlFor="steps" className="text-gray-700 font-bold">
        Steps:
      </label>
      <input
        type="number"
        value={selectedSteps || ""}
        onChange={handleInputChange}
        className="px-4 py-2 border-2 border-gray-400 rounded-lg"
        placeholder="Enter steps"
      />
      <button
  type="submit"
  className="px-4 py-2 text-sm text-white bg-brown rounded-full hover:bg-green-800 transition duration-200"
>
  Filter
</button>

    </form>
  );
};

export default StepsFilter;