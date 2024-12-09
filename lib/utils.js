import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


/**
 * Highlights matching words in a string based on a query.
 * @param {string} text - The text to search within.
 * @param {string} query - The search query.
 * @returns {JSX.Element | string} The text with matching words highlighted.
 */
export const highlightText = (text, query) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi"); // Case-insensitive matching
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-[var(--button-bg)]  font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
};
