"use client";

import { useState } from "react";
import Image from 'next/image';

export default function Carousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Determine if there are more than one image
  const hasMultipleImages = images.length > 1;

  return (
    <div className="relative w-full h-64 overflow-hidden">
      <Image
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        width={500}
        height={500}
        quality={75}
        priority
        className="w-full h-full object-contain"
      />
      {/* Previous Button */}
      {hasMultipleImages && (
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[var(--button-bg)] p-2 rounded-full shadow hover:bg-[var(--button-hover-bg)] transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[var(--icon-color)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      {/* Next Button */}
      {hasMultipleImages && (
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[var(--button-bg)] p-2 rounded-full shadow hover:bg-[var(--button-hover-bg)] transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[var(--icon-color)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
  }
