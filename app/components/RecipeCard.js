import Head from "next/head";
import Link from "next/link";
import Carousel from "./Carousel";
import { highlightText } from "../../lib/utils";

/**
 * RecipeCard component displays a recipe with detailed information including
 * images, title, preparation time, and publication date.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Recipe data
 * @param {string} props.recipe.title - Title of the recipe
 * @param {string} props.recipe.published - Published date of the recipe
 * @param {number} props.recipe.prep - Preparation time in minutes
 * @param {number} props.recipe.cook - Cooking time in minutes
 * @param {Array<string>} props.recipe.images - Array of image URLs for the recipe
 */

export default function RecipeCard({ recipe, searchQuery }) {
  /**
   * Formats a date string to a readable format.
   *
   * @param {string} dateString - The date string to format
   * @returns {string} Formatted date in "Month Day, Year" format
   */
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };
  // Calculate total time by adding prep and cook times
  const totalTime = (recipe.prep || 0) + (recipe.cook || 0);
  return (
    <div className="bg-[var(--card-bg)] rounded-lg overflow-hidden shadow-md hover:shadow-2xl hover:shadow-[var(--hover-shadow)] p-4">
      <Head>
        <title>{recipe.title} | Recipe Details</title>
        <meta
          name="description"
          content={`Learn to make ${recipe.title} with this detailed recipe. Prep time: ${recipe.prep} mins, Cook time: ${recipe.cook} mins.`}
        />
        <meta property="og:title" content={recipe.title} />
        <meta
          property="og:description"
          content={`Recipe for ${recipe.title}. Total time: ${totalTime} mins.`}
        />
        <meta property="og:image" content={recipe.images[0]} />
        {/* <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={recipe.title} />
      <meta name="twitter:description" content={`Detailed recipe for ${recipe.title}.`} />
      <meta name="twitter:image" content={recipe.images[0]} /> */}
      </Head>
      <Carousel
        images={recipe.images}
        alt={recipe.title}
        className="w-full h-48 object-cover rounded-md"
      />
      <p className="text-[var(--text-muted)] text-xs mt-1">
        Published : {formatDate(recipe.published)}
      </p>
      <div className="p-4">
        <h3 className="text-[var(--text-heading)] font-bold text-xl">
        {highlightText(recipe.title, searchQuery)}
        </h3>

        <div className="flex items-center justify-between mt-3 p-4">
          <p className="flex flex-col items-center text-[var(--prep-time-color)] flex-grow text-center">
            <svg
              fill="currentColor"
              width="25px"
              height="25px"
              viewBox="0 0 128 128"
              id="Layer_1"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path d="M72.907,45.526H58.482l2.874-24.867c0.681-3.322-0.089-6.589-2.084-8.927c-0.22-0.283-0.451-0.532-0.639-0.696 c-1.989-2.016-4.65-3.126-7.492-3.126c-2.489,0-4.925,0.888-6.867,2.506c-2.865,2.438-4.148,6.39-3.361,10.228l2.864,24.883H27.039 c-3.375,0-6.12,2.745-6.12,6.12v62.257c0,3.362,2.746,6.097,6.12,6.097h45.869c3.375,0,6.12-2.735,6.12-6.097V51.646 C79.027,48.271,76.282,45.526,72.907,45.526z M77.027,113.903c0,2.259-1.848,4.097-4.12,4.097H27.039 c-2.272,0-4.12-1.838-4.12-4.097V51.646c0-2.271,1.848-4.12,4.12-4.12h17.861c0,0,0,0,0.001,0c0.038,0,0.076-0.002,0.114-0.006 c0.049-0.006,0.089-0.032,0.136-0.044c0.065-0.017,0.129-0.032,0.188-0.061c0.058-0.029,0.106-0.067,0.157-0.106 c0.051-0.039,0.101-0.075,0.144-0.123c0.043-0.048,0.073-0.102,0.106-0.158c0.033-0.055,0.065-0.106,0.087-0.167 c0.023-0.063,0.03-0.129,0.04-0.197c0.007-0.047,0.028-0.089,0.028-0.137c0-0.02-0.01-0.036-0.011-0.056 c-0.001-0.02,0.007-0.038,0.005-0.058L42.887,20.33c-0.655-3.209,0.374-6.425,2.676-8.384c1.576-1.313,3.557-2.036,5.579-2.036 c2.303,0,4.458,0.899,6.116,2.576c0.144,0.128,0.291,0.288,0.464,0.509c1.597,1.873,2.223,4.588,1.662,7.349l-3.016,26.067 c-0.002,0.02,0.006,0.037,0.005,0.057c-0.001,0.02-0.012,0.037-0.012,0.058c0,0.05,0.021,0.092,0.028,0.14 c0.01,0.066,0.017,0.131,0.039,0.193c0.022,0.062,0.055,0.114,0.088,0.17c0.033,0.055,0.063,0.108,0.105,0.156 c0.043,0.049,0.094,0.085,0.146,0.125c0.05,0.038,0.098,0.076,0.155,0.104c0.06,0.03,0.125,0.045,0.192,0.062 c0.046,0.012,0.084,0.038,0.133,0.043c0.02,0.003,0.039-0.006,0.059-0.005c0.02,0.001,0.036,0.011,0.056,0.011h15.547 c2.272,0,4.12,1.848,4.12,4.12V113.903z"></path>
                  <path d="M51.142,13.052c-3.13,0-5.676,2.546-5.676,5.675s2.546,5.676,5.676,5.676s5.676-2.546,5.676-5.676 S54.271,13.052,51.142,13.052z M51.142,22.403c-2.027,0-3.676-1.649-3.676-3.676c0-2.026,1.649-3.675,3.676-3.675 s3.676,1.649,3.676,3.675C54.817,20.754,53.168,22.403,51.142,22.403z"></path>
                  <path d="M85.351,22.147c-0.722,0-1.31,0.587-1.31,1.31v55.799v34.308c0,2.259,1.838,4.098,4.098,4.098h7.832 c2.259,0,4.098-1.838,4.098-4.098V80.256h6.014c0.552,0,1-0.448,1-1V43.879C107.082,31.896,97.333,22.147,85.351,22.147z M95.97,115.662h-7.832c-1.157,0-2.098-0.941-2.098-2.098V84.932h12.027v28.632C98.068,114.721,97.127,115.662,95.97,115.662z M98.068,82.932H86.041v-2.676h12.027V82.932z M105.082,78.256h-6.014H86.041V24.159c10.561,0.365,19.041,9.071,19.041,19.72 V78.256z"></path>
                </g>
              </g>
            </svg>
            {recipe.prep} mins
          </p>
          {/* Display cooking time */}
          <p className="flex flex-col items-center text-[var(--prep-time-color)] flex-grow text-center">
            <svg
              fill="currentColor"
              height="25px"
              width="25px"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512.853 512.853"
            >
              <g>
                <g transform="translate(1)">
                  <path d="M476.867,196.693h-34.133V162.56h8.533c5.12,0,8.533-3.413,8.533-8.533c0-5.12-3.413-8.533-8.533-8.533H434.2h-22.425 l89.839-86.187c13.653-13.653,13.653-34.987,0-48.64c-13.653-13.653-34.987-13.653-48.64,0L323.171,145.493H75.8H58.733 c-5.12,0-8.533,3.413-8.533,8.533c0,5.12,3.413,8.533,8.533,8.533h8.533v34.133H33.133C14.36,196.693-1,212.053-1,230.827v51.2 c0,18.773,15.36,34.133,34.133,34.133h34.133v153.6c0,23.893,18.773,42.667,42.667,42.667h290.133 c23.893,0,42.667-18.773,42.667-42.667v-153.6h34.133c18.773,0,34.133-15.36,34.133-34.133v-51.2 C511,212.053,495.64,196.693,476.867,196.693z M464.92,22.613c6.827-6.827,17.067-6.827,23.893,0 c6.827,5.973,6.827,17.067,0,23.893l-101.547,98.987H347.16L464.92,22.613z M33.133,299.093c-9.387,0-17.067-7.68-17.067-17.067 v-51.2c0-9.387,7.68-17.067,17.067-17.067h34.133v85.333H33.133z M425.667,469.76c0,14.507-11.093,25.6-25.6,25.6H109.933 c-14.507,0-25.6-11.093-25.6-25.6V307.627v-102.4V162.56H326.68h64h34.987v42.667v102.4V469.76z M493.933,282.027 c0,9.387-7.68,17.067-17.067,17.067h-34.133V213.76h34.133c9.387,0,17.067,7.68,17.067,17.067V282.027z"></path>
                  <path d="M167.107,127.573c1.707,0.853,2.56,0.853,4.267,0.853c3.413,0,5.973-1.707,7.68-4.267 c2.56-4.267,0.853-9.387-3.413-11.947c-9.387-4.267-14.507-11.093-14.507-17.92c0-7.68,5.12-15.36,15.36-23.04 c12.8-9.387,19.627-23.04,18.773-37.547c-0.853-12.8-8.533-24.747-21.333-32.427c-4.267-1.707-9.387-0.853-11.947,3.413 c-1.707,4.267-0.853,9.387,3.413,11.947c7.68,4.267,11.947,11.093,12.8,18.773c0.853,7.68-3.413,16.213-11.093,22.187 c-15.36,10.24-23.893,23.893-23.04,37.547C144.067,108.8,152.6,119.893,167.107,127.573z"></path>
                  <path d="M269.507,127.573c1.707,0.853,2.56,0.853,4.267,0.853c3.413,0,5.973-1.707,7.68-4.267 c2.56-4.267,0.853-9.387-3.413-11.947c-9.387-4.267-14.507-11.093-14.507-17.92c0-7.68,5.12-15.36,15.36-23.04 c12.8-9.387,19.627-23.04,18.773-37.547c-0.853-12.8-8.533-24.747-21.333-32.427c-4.267-1.707-9.387-0.853-11.947,3.413 c-1.707,4.267-0.853,9.387,3.413,11.947c7.68,4.267,11.947,11.093,12.8,18.773c0.853,7.68-3.413,16.213-11.093,22.187 c-15.36,10.24-23.893,23.893-23.04,37.547C246.467,108.8,255,119.893,269.507,127.573z"></path>
                  <path d="M135.533,179.627h-17.067c-9.387,0-17.067,7.68-17.067,17.067v17.067c0,9.387,7.68,17.067,17.067,17.067h17.067 c9.387,0,17.067-7.68,17.067-17.067v-17.067C152.6,187.307,144.92,179.627,135.533,179.627z M135.533,213.76h-17.067v-17.067 h17.067V213.76z"></path>
                  <path d="M135.533,427.093h-17.067c-9.387,0-17.067,7.68-17.067,17.067v17.067c0,9.387,7.68,17.067,17.067,17.067h17.067 c9.387,0,17.067-7.68,17.067-17.067V444.16C152.6,434.773,144.92,427.093,135.533,427.093z M135.533,461.227h-17.067V444.16 h17.067V461.227z"></path>
                  <path d="M391.533,427.093h-17.067c-9.387,0-17.067,7.68-17.067,17.067v17.067c0,9.387,7.68,17.067,17.067,17.067h17.067 c9.387,0,17.067-7.68,17.067-17.067V444.16C408.6,434.773,400.92,427.093,391.533,427.093z M391.533,461.227h-17.067V444.16 h17.067V461.227z"></path>
                  <path d="M391.533,213.76h-17.067c-9.387,0-17.067,7.68-17.067,17.067v17.067c0,9.387,7.68,17.067,17.067,17.067h17.067 c9.387,0,17.067-7.68,17.067-17.067v-17.067C408.6,221.44,400.92,213.76,391.533,213.76z M391.533,247.893h-17.067v-17.067 h17.067V247.893z"></path>
                </g>
              </g>
            </svg>
            {recipe.cook} mins
          </p>

          <p className="flex flex-col items-center text-[var(--prep-time-color)] flex-grow text-center">
            <svg
              fill="currentColor"
              width="25px"
              height="25px"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#currentColor"
            >
              <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2" fill="none" />
              <polyline points="40 44 32 32 32 16" stroke ="currentColor" strokeWidth="4px" />
            </svg>
            {totalTime} Mins Total
          </p>

          <p className="flex flex-col items-center text-[var(--prep-time-color)] flex-grow text-center">
            <svg
              fill="currentColor"
              height="25px"
              width="25px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="M503.83,388.085H8.17c-4.513,0-8.17,3.657-8.17,8.17s3.657,8.17,8.17,8.17h25.333c3.795,18.624,20.3,32.681,40.029,32.681h364.936c19.728,0,36.233-14.057,40.029-32.681h25.333c4.513,0,8.17-3.657,8.17-8.17S508.343,388.085,503.83,388.085z M438.468,420.766H73.532c-10.651,0-19.733-6.831-23.105-16.34h411.147C458.201,413.935,449.119,420.766,438.468,420.766z" />
                <circle cx="156.868" cy="232.851" r="8.17" />
                <circle cx="124.187" cy="265.532" r="8.17" />
                <path d="M264.17,140.421v-16.506h24.511c4.513,0,8.17-3.657,8.17-8.17c0-22.526-18.325-40.851-40.851-40.851s-40.851,18.325-40.851,40.851c0,4.513,3.657,8.17,8.17,8.17s8.17-3.657,8.17-8.17c0-13.515,10.996-24.511,24.511-24.511c10.652,0,19.738,6.83,23.111,16.34H256c-4.513,0-8.17,3.657-8.17,8.17v24.676C128.463,144.737,32.681,243.173,32.681,363.574c0,4.513,3.657,8.17,8.17,8.17s8.17-3.657,8.17-8.17c0-114.129,92.85-206.979,206.979-206.979s206.979,92.85,206.979,206.979c0,4.513,3.657,8.17,8.17,8.17s8.17-3.657,8.17-8.17C479.319,243.173,383.537,144.737,264.17,140.421z" />
              </g>
            </svg>
            {recipe.servings} Servings
          </p>
        </div>

        <Link
          href={`/recipes/${recipe._id}`}
          className="mt-4 block text-center font-bold text-[var(--button-text-color)] bg-[var(--button-bg-color)] rounded-full py-2 hover:bg-[var(--button-hover-bg-color)] transition duration-200"

        >
          Get Cooking
        </Link>
      </div>
    </div>
  );
}
