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
    <form onSubmit={handleSearch} className="flex items-center space-x-4">
      <label
        htmlFor="steps"
        className="text-[var(--foreground)] font-bold"
      >
        Steps:
      </label>
      <input
        type="number"
        value={selectedSteps || ""}
        onChange={handleInputChange}
        className="px-4 py-2 border-2 rounded-lg"
        style={{
          backgroundColor: "var(--filter-bg)",
          borderColor: "var(--filter-border)",
          color: "var(--filter-text)",
        }}
        placeholder="Enter steps"
      />
      <button
        type="submit"
        className="px-4 py-2 text-sm rounded-full transition duration-200"
        style={{
          backgroundColor: "var(--button-bg)",
          color: "var(--button-text)",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--button-hover-bg)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--button-bg)")
        }
      >
        Filter
      </button>
    </form>
  );  
};

export default StepsFilter;