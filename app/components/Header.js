"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  // State to track mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="glossy-highlight fixed top-0 left-0 w-full z-50 bg-[var(--header-bg)] bg-opacity-80 shadow-md backdrop-blur-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <div className="h-10 cursor-pointer">
              <Image
                src="/ArejengLogo.png"
                alt="Logo"
                width={40}
                height={40}
                className="h-full w-auto"
              />
            </div>
          </Link>
          <Link href="/">
            <h1 className="text-[var(--header-text)] text-xl md:text-2xl font-bold">
              Arejeng
            </h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/recipe">
            <span className="hover:text-[var(--link-hover)] cursor-pointer">
              Recipes
            </span>
          </Link>
          <Link href="/favourites">
            <span className="hover:text-[var(--link-hover)] cursor-pointer">
              Favourites
            </span>
          </Link>
          <Link href="/login">
            <button className="bg-[var(--button-bg)] px-3 py-1 rounded-full">
              <span className="font-bold text-[var(--login-text)]">Login</span>
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-[var(--button-bg)] px-3 py-1 rounded-full">
              <span className="font-bold text-[var(--signup-text)]">Sign Up</span>
            </button>
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-[var(--header-text)] focus:outline-none"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--header-bg)] shadow-md py-3">
          <nav className="flex flex-col space-y-4 px-4">
            <Link href="/recipe">
              <span className="hover:text-[var(--link-hover)] cursor-pointer">
                Recipes
              </span>
            </Link>
            <Link href="/favourites">
              <span className="hover:text-[var(--link-hover)] cursor-pointer">
                Favourites
              </span>
            </Link>
            <Link href="/login">
              <button className="bg-[var(--button-bg)] px-3 py-1 rounded-full w-full text-left">
                <span className="font-bold text-[var(--login-text)]">Login</span>
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-[var(--button-bg)] px-3 py-1 rounded-full w-full text-left">
                <span className="font-bold text-[var(--signup-text)]">Sign Up</span>
              </button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;