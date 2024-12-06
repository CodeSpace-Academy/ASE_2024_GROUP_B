"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

/**
 * @typedef {Object} SpinningGearProps
 * @property {string} [className] - Additional CSS classes for the SVG.
 */

/**
 * Renders a spinning gear SVG animation.
 * @function
 * @returns {JSX.Element} The SpinningGear component.
 */
const SpinningGear = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </motion.svg>
);

/**
 * @typedef {Object} ErrorProps
 * @property {Error} error - The error object.
 * @property {Function} reset - Function to reset the error state.
 */

/**
 * Renders an error page with animation and a reset button.
 * @function
 * @param {ErrorProps} props - The component props.
 * @returns {JSX.Element} The Error component.
 */
export default function Error({ error, reset }) {
  /**
   * Logs the error to the console when the component mounts or the error changes.
   */
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex items-center h-full p-[1.28rem] text-primary">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SpinningGear />
          </motion.div>
          <motion.h2
            className="mb-8 font-extrabold text-9xl text-highlight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="sr-only">Error</span>Oops!
          </motion.h2>
          <motion.p
            className="text-2xl font-semibold md:text-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Something went wrong!
          </motion.p>
          <motion.p
            className="mt-4 mb-8 text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Don&apos;t worry, try refreshing or return to the homepage.
          </motion.p>
          <motion.div
            className="flex justify-center space-x-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.button
              onClick={() => reset()}
              className="px-8 py-3 font-semibold rounded bg-button text-button-text hover:bg-button-hover focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try again
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
  }
