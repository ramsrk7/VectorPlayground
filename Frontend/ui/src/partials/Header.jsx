// src/partials/Header.jsx
import React from 'react';

const Header = ({ sidebarOpen, setSidebarOpen }) => (
  <header className="bg-red-600 text-white p-4 shadow flex items-center justify-between fixed top-0 left-0 right-0 z-50 lg:hidden">
    {/* Hamburger Menu (Visible on Mobile) */}
    <button
      className="text-white hover:text-gray-200 focus:outline-none"
      onClick={() => {
        console.log('Hamburger button clicked'); // Debugging line
        setSidebarOpen(!sidebarOpen);
      }}
      aria-controls="sidebar"
      aria-expanded={sidebarOpen}
    >
      <span className="sr-only">Toggle sidebar</span>
      {sidebarOpen ? (
        // Close icon (X)
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        // Hamburger icon
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      )}
    </button>

    {/* Logo or Brand Name */}
    <h1 className="text-2xl font-bold font-mono">Vector Playground</h1>

    {/* Optional: Placeholder for alignment or additional buttons */}
    <div></div>
  </header>
);

export default Header;
